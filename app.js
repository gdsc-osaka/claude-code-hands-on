// ===========================
// TaskFlow - Main Application
// BUG HUNT: Can you find all the bugs?
// ===========================

// --- State ---
let tasks = [];
let nextId = 1;
let currentFilter = 'all';
let editingTaskId = null;

// --- Initial Data ---
const SAMPLE_TASKS = [
  {
    id: nextId++,
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'high',
    status: 'todo',
    assignee: 'Alice',
    due: '2026-05-01',
    createdAt: Date.now(),
  },
  {
    id: nextId++,
    title: 'Write unit tests for auth module',
    description: 'Cover login, logout, token refresh, and error cases.',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Bob',
    due: '2026-04-30',
    createdAt: Date.now(),
  },
  {
    id: nextId++,
    title: 'Update dependencies',
    description: 'Run npm audit and upgrade packages with known vulnerabilities.',
    priority: 'medium',
    status: 'todo',
    assignee: 'Alice',
    due: '2026-05-10',
    createdAt: Date.now(),
  },
  {
    id: nextId++,
    title: 'Design new dashboard layout',
    description: 'Wireframes and mockups for Q2 redesign.',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'Carol',
    due: '2026-05-05',
    createdAt: Date.now(),
  },
  {
    id: nextId++,
    title: 'Fix login page memory leak',
    description: 'Event listeners are not cleaned up on component unmount.',
    priority: 'high',
    status: 'done',
    assignee: 'Bob',
    due: '2026-04-20',
    createdAt: Date.now(),
  },
  {
    id: nextId++,
    title: 'Migrate to TypeScript',
    description: 'Convert core utilities to TypeScript for better type safety.',
    priority: 'low',
    status: 'todo',
    assignee: '',
    due: '',
    createdAt: Date.now(),
  },
];

// --- DOM Helpers ---
function $(id) {
  return document.getElementById(id);
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
  $('task-form').reset();
  editingTaskId = null;
  $('modal-title').textContent = 'New Task';
}

function openModal(task = null) {
  editingTaskId = task ? task.id : null;
  $('modal-title').textContent = task ? 'Edit Task' : 'New Task';

  if (task) {
    $('task-title').value = task.title;
    $('task-description').value = task.description;
    $('task-priority').value = task.priority;
    $('task-assignee').value = task.assignee;
    $('task-due').value = task.due;
  }

  $('modal-overlay').classList.add('open');
  $('task-title').focus();
}

// --- Rendering ---
function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // BUG 1: This comparison is wrong — new Date(dateStr) parses as UTC midnight,
  // so in many timezones "today" shows as overdue. Fix the date comparison.
  const isOverdue = due < today;
  const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `<span class="due-date ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠ ' : ''}${label}</span>`;
}

function getStatusLabel(status) {
  const labels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
  return labels[status] || status;
}

function getMoveButtons(task) {
  const moves = [];
  if (task.status !== 'todo') {
    moves.push({ label: '← To Do', target: 'todo' });
  }
  if (task.status !== 'in-progress') {
    moves.push({ label: task.status === 'todo' ? 'Start →' : '← In Progress', target: 'in-progress' });
  }
  if (task.status !== 'done') {
    moves.push({ label: 'Done ✓', target: 'done' });
  }
  return moves
    .map(m => `<button class="task-move" data-task-id="${task.id}" data-target="${m.target}">${m.label}</button>`)
    .join('');
}

function renderTask(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.status}`;
  card.dataset.taskId = task.id;

  card.innerHTML = `
    <div class="task-card-header">
      <span class="task-title">${escapeHtml(task.title)}</span>
      <div class="task-actions">
        <button class="btn btn-danger task-delete" data-task-id="${task.id}">Delete</button>
      </div>
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    <div class="task-meta">
      <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      ${task.assignee ? `<span class="assignee">👤 ${escapeHtml(task.assignee)}</span>` : ''}
      ${formatDueDate(task.due)}
    </div>
    <div class="task-meta" style="margin-top: 8px; gap: 6px;">
      ${getMoveButtons(task)}
    </div>
  `;

  // Edit on title click
  card.querySelector('.task-title').addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(task);
  });

  return card;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function getFilteredTasks() {
  let filtered = tasks;

  // Filter by status
  if (currentFilter !== 'all') {
    filtered = filtered.filter(t => t.status === currentFilter);
  }

  // Filter by search
  const query = $('search-input').value.trim().toLowerCase();
  if (query) {
    // BUG 2: Search only checks title but not description or assignee.
    // Users expect to find tasks by description or assignee too.
    filtered = filtered.filter(t => t.title.toLowerCase().includes(query));
  }

  return filtered;
}

function render() {
  const filtered = getFilteredTasks();

  // Clear columns
  ['todo', 'in-progress', 'done'].forEach(status => {
    $(`list-${status}`).innerHTML = '';
  });

  // Group tasks by status
  const byStatus = { todo: [], 'in-progress': [], done: [] };
  filtered.forEach(task => {
    if (byStatus[task.status]) {
      byStatus[task.status].push(task);
    }
  });

  // Render each column
  Object.entries(byStatus).forEach(([status, columnTasks]) => {
    const list = $(`list-${status}`);
    const count = $(`count-${status}`);

    // BUG 3: Column counts show filtered count, not total count.
    // The count badge should always show the total for that status, not filtered.
    count.textContent = columnTasks.length;

    if (columnTasks.length === 0) {
      list.innerHTML = '<div class="empty-state">No tasks here</div>';
    } else {
      columnTasks.forEach(task => list.appendChild(renderTask(task)));
    }
  });

  // Update header count
  // BUG 4: The task count header says "X tasks" but never says "1 task" (wrong pluralization).
  $('task-count').textContent = `${tasks.length} tasks`;
}

// --- CRUD ---
function addTask(data) {
  const task = {
    id: nextId++,
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
    status: 'todo',
    assignee: data.assignee.trim(),
    due: data.due,
    createdAt: Date.now(),
  };
  tasks.push(task);
  saveToStorage();
  render();
}

function updateTask(id, data) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  Object.assign(task, {
    title: data.title.trim(),
    description: data.description.trim(),
    priority: data.priority,
    assignee: data.assignee.trim(),
    due: data.due,
  });
  saveToStorage();
  render();
}

function deleteTask(id) {
  // BUG 5: No confirmation before deleting — tasks can be deleted accidentally.
  // Add a confirmation dialog before removing the task.
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  render();
}

function moveTask(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.status = newStatus;
  saveToStorage();
  render();
}

// --- Persistence ---
function saveToStorage() {
  // BUG 6: nextId is not saved to localStorage, so after a page refresh,
  // new tasks will get duplicate IDs starting from 1 again.
  localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
}

function loadFromStorage() {
  const stored = localStorage.getItem('taskflow-tasks');
  if (stored) {
    tasks = JSON.parse(stored);
    // Re-calculate nextId from loaded tasks to avoid duplicate IDs
    // (This is incomplete — see BUG 6)
    nextId = 1;
  } else {
    tasks = [...SAMPLE_TASKS];
    saveToStorage();
  }
}

// --- Event Listeners ---
function initEventListeners() {
  // Open modal
  $('add-task-btn').addEventListener('click', () => openModal());

  // Close modal
  $('modal-close').addEventListener('click', closeModal);
  $('modal-cancel').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('modal-overlay')) closeModal();
  });

  // Submit form
  $('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      title: $('task-title').value,
      description: $('task-description').value,
      priority: $('task-priority').value,
      assignee: $('task-assignee').value,
      due: $('task-due').value,
    };

    if (editingTaskId !== null) {
      updateTask(editingTaskId, data);
    } else {
      addTask(data);
    }
    closeModal();
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Search
  $('search-input').addEventListener('input', () => render());

  // Task actions (delete + move) via delegation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-delete')) {
      const id = parseInt(e.target.dataset.taskId);
      deleteTask(id);
    }
    if (e.target.classList.contains('task-move')) {
      const id = parseInt(e.target.dataset.taskId);
      const target = e.target.dataset.target;
      moveTask(id, target);
    }
  });
}

// --- Init ---
function init() {
  loadFromStorage();
  initEventListeners();
  render();
}

init();
