# Task Manager — Product Requirements

## Overview

A Kanban-style task management application built with React. Users can organize tasks
across multiple columns, reorder them via drag-and-drop, and manage them individually
or in bulk.

---

## Tech Stack

- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS (no UI/component libraries allowed)
- **State:** Valtio
- **Drag & Drop:** [@atlaskit/pragmatic-drag-and-drop](https://atlassian.design/components/pragmatic-drag-and-drop) only

---

## Core Features

### Columns

- **Add columns** — users can create new columns with a custom name.
- **Delete columns** — users can remove a column (and its tasks).
- **Reorder columns** — users can drag and drop columns to change their order.

### Tasks

- **Add tasks** — users can add new tasks to any column.
- **Delete tasks** — users can remove individual tasks.
- **Edit tasks** — users can edit the text of a task after it has been created (inline edit).
- **Mark complete / incomplete** — users can toggle the completion status of a task.
- **Move tasks across columns** — users can move a task from one column to another.
- **Reorder tasks** — users can drag and drop tasks to reorder them within a column or move them to another column.

### Bulk Actions

- **Multi-select** — users can select multiple tasks across columns for bulk operations.
- **Select all (per column)** — each column has a "Select all" control to select every task in that column.
- **Bulk delete** — delete all selected tasks at once.
- **Bulk mark complete** — mark all selected tasks as complete.
- **Bulk mark incomplete** — mark all selected tasks as incomplete.
- **Bulk move** — move all selected tasks to a chosen column.

### Search & Filter

- **Search by name** — a search input filters the visible tasks by their text content.
- **Highlight matches** — the matched portion of a task's text is visually highlighted in the search results.
- **Smart search** — search supports fuzzy/similarity matching, not just exact substring matches (implementation approach left to developer's discretion).
- **Filter by status** — users can filter the task list to show:
  - All tasks
  - Completed tasks only
  - Incomplete tasks only

---

## Visual & UX Requirements

- **Completed tasks** are visually distinguished from incomplete tasks (e.g. strikethrough text, muted color, checkmark).
- **Simple, modern design** — clean UI with clear affordances; no clutter.
- **Responsive layout** — the application must work well on both desktop and mobile screen sizes.
- No UI or component libraries may be used. All components must be custom-built with Tailwind CSS.

---

## Data Persistence

- The full application state (columns, tasks, order) must be **persisted in `localStorage`** so that it survives page refreshes.

---

## Bonus Features

- **Text highlight on search** — while the user types in the search box, matching substrings inside task names are highlighted (e.g. with a yellow background).
- **Smart / fuzzy search** — search results include tasks that are similar to the query, not just exact matches.
- **Code documentation** — all non-trivial functions and components should include JSDoc comments explaining their purpose, parameters, and return values.

---

## Out of Scope

- User authentication / accounts
- Backend / API integration
- Real-time collaboration
- Notifications or reminders
