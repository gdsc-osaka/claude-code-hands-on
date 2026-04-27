# TaskFlow — Claude Code Hands-On

A simple kanban-style task manager with **intentional bugs** and **missing features** — designed for a ~1 hour Claude Code workshop.

## Quick Start

```bash
# Open in browser (no build step needed)
open index.html
```

---

## Workshop Structure (~60 min)

| # | Exercise | Skill | Time |
|---|----------|-------|------|
| 1 | Bug Hunt | Reading & fixing code | 15 min |
| 2 | New Feature | Adding functionality | 20 min |
| 3 | Refactor | Code quality | 15 min |
| 4 | Tests | Writing tests | 10 min |

---

## Exercise 1 — Bug Hunt (15 min)

There are **6 bugs** hidden in `app.js`. Find and fix them with Claude Code.

**Tips for prompting:**
- "Find all the bugs in app.js and explain each one"
- "Fix bug #3 in app.js"
- "The task count shows '1 tasks' — fix the grammar"

### Bug List (spoilers below — try finding them first!)

<details>
<summary>Reveal bugs</summary>

| # | Location | Bug |
|---|----------|-----|
| 1 | `formatDueDate()` | Date parsed as UTC midnight, causing off-by-one timezone issues |
| 2 | `getFilteredTasks()` | Search only checks `title`, not `description` or `assignee` |
| 3 | `render()` | Column counts show filtered count, not total count for that status |
| 4 | `render()` | "X tasks" never uses singular "1 task" |
| 5 | `deleteTask()` | No confirmation dialog — tasks deleted instantly with no undo |
| 6 | `saveToStorage()` | `nextId` not persisted — after refresh, new tasks get duplicate IDs |

</details>

---

## Exercise 2 — New Feature (20 min)

Pick **one** feature to add:

### Option A — Priority Sorting
Sort tasks within each column by priority (high → medium → low).

**Starter prompt:**
> "Add a sort button to each column that sorts tasks by priority, high first."

### Option B — Dark Mode
Add a dark mode toggle to the header.

**Starter prompt:**
> "Add a dark mode toggle button to the header. Store the preference in localStorage."

### Option C — Task Tags
Let users add comma-separated tags to tasks and filter by tag.

**Starter prompt:**
> "Add a tags field to the task form. Show tags as small badges on each card. Add a tag filter dropdown to the filters bar."

### Option D — Due Date Sorting
Add a "Sort by due date" option and highlight tasks due within 2 days.

**Starter prompt:**
> "Sort tasks by due date within each column. Highlight tasks due within 2 days with a yellow border."

---

## Exercise 3 — Refactor (15 min)

The `render()` and `renderTask()` functions are doing too much.

**Prompt ideas:**
- "Refactor renderTask() to be more readable"
- "Extract the column rendering logic into a separate renderColumn() function"
- "The render function re-renders all columns on every change. Optimize it to only update affected columns."

---

## Exercise 4 — Tests (10 min)

There are no tests! Add tests for the core logic.

**Setup:**
```bash
npm init -y
npm install --save-dev vitest
```

**Prompt:**
> "Write Vitest unit tests for the addTask, deleteTask, moveTask, and getFilteredTasks functions in app.js. Refactor the functions as needed to make them testable (pure functions)."

---

## Files

```
.
├── index.html   # App shell + modal markup
├── style.css    # All styles (CSS variables, responsive)
├── app.js       # App logic — bugs live here!
└── README.md    # This file
```

---

## Useful Claude Code Prompts

```
# Explain what code does
"Walk me through how task filtering works in app.js"

# Find problems
"Review app.js for bugs, security issues, and code quality problems"

# Add a feature end-to-end
"Add drag-and-drop support to move tasks between columns"

# Write documentation
"Add JSDoc comments to all functions in app.js"

# Fix a specific file
"Fix the date comparison bug in formatDueDate"
```
