# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TaskFlow** is a vanilla JavaScript kanban-style task manager built as a hands-on Claude Code workshop project. It intentionally contains bugs and missing features for participants to find and fix.

## Running the App

No build step required — open `index.html` directly in a browser:

```bash
open index.html
```

## Testing

No `package.json` exists by default. To set up and run tests (part of Exercise 4):

```bash
npm init -y
npm install --save-dev vitest
npx vitest run
```

Test file: `app.test.js`

## Architecture

Single-page application with all logic in `app.js`. No frameworks, no build tools.

**Global state:**
- `tasks[]` — array of task objects
- `nextId` — auto-increment ID counter
- `currentFilter` — active status filter (`'all'` | `'todo'` | `'in-progress'` | `'done'`)
- `editingTaskId` — ID of task being edited, or `null`

**Task data model:**
```js
{ id, title, description, priority, status, assignee, due, createdAt }
```
- `priority`: `'low'` | `'medium'` | `'high'`
- `status`: `'todo'` | `'in-progress'` | `'done'`

**Key function groups in `app.js`:**
- Rendering: `render()`, `renderTask()`, `formatDueDate()`, `getMoveButtons()`
- CRUD: `addTask()`, `updateTask()`, `deleteTask()`, `moveTask()`
- Filtering: `getFilteredTasks()`
- Persistence: `saveToStorage()`, `loadFromStorage()` (localStorage)
- Event wiring: `initEventListeners()`, `init()`

Persistence uses `localStorage`. Sample data is loaded on first run if no saved state exists.

## Known Intentional Bugs (Workshop Exercises)

These bugs exist on purpose — do not fix them unless asked:

1. **`formatDueDate()`** — Date parsed as UTC midnight, causing off-by-one timezone errors
2. **`getFilteredTasks()`** — Search only checks `title`, not `description` or `assignee`
3. **`render()`** — Column counts show filtered count, not total per-status count
4. **`render()`** — Pluralization error: shows "1 tasks" instead of "1 task"
5. **`deleteTask()`** — No confirmation dialog; tasks deleted immediately
6. **`saveToStorage()`** — `nextId` not persisted, causing duplicate IDs after refresh
