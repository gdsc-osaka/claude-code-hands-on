// ===========================
// TaskFlow - Tests (Starter File)
// Exercise 4: Fill these in!
// ===========================
//
// Run with:
//   npm install --save-dev vitest
//   npx vitest run
//
// Your goal: make all tests pass, then add more.
//
// HINT: The functions in app.js are not easily testable as-is because
// they rely on DOM and global state. You'll need to extract pure logic
// functions. Ask Claude Code to help you refactor!

import { describe, it, expect, beforeEach } from 'vitest';

// TODO: import the functions you extract from app.js
// import { filterTasks, sortByPriority, formatDueDate } from './app.js';

describe('filterTasks', () => {
  const sampleTasks = [
    { id: 1, title: 'Fix login bug', description: 'Auth issue', assignee: 'Alice', status: 'todo', priority: 'high' },
    { id: 2, title: 'Write tests', description: 'Unit and integration', assignee: 'Bob', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Deploy to prod', description: 'Release v2', assignee: 'Alice', status: 'done', priority: 'high' },
  ];

  it('returns all tasks when filter is "all" and no query', () => {
    // TODO: replace with real assertion
    expect(true).toBe(true);
  });

  it('filters by status', () => {
    // TODO
    expect(true).toBe(true);
  });

  it('searches by title', () => {
    // TODO
    expect(true).toBe(true);
  });

  it('searches by description (Bug #2 fix)', () => {
    // TODO: after fixing bug #2, search should match description
    expect(true).toBe(true);
  });

  it('searches by assignee (Bug #2 fix)', () => {
    // TODO: after fixing bug #2, search should match assignee
    expect(true).toBe(true);
  });
});

describe('pluralizeTaskCount', () => {
  it('returns "1 task" for a single task (Bug #4 fix)', () => {
    // TODO
    expect(true).toBe(true);
  });

  it('returns "2 tasks" for multiple tasks', () => {
    // TODO
    expect(true).toBe(true);
  });
});

describe('formatDueDate', () => {
  it('returns empty string for no date', () => {
    // TODO
    expect(true).toBe(true);
  });

  it('marks past dates as overdue', () => {
    // TODO
    expect(true).toBe(true);
  });

  it('does not mark today as overdue (Bug #1 fix)', () => {
    // TODO: after fixing bug #1, today should NOT be overdue
    expect(true).toBe(true);
  });
});
