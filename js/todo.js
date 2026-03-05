/**
 * todo.js
 *
 * To-do list widget.
 * Tasks are stored in localStorage as an array of objects:
 *   [{ id: number, text: string, completed: boolean }, ...]
 *
 * The pattern used here is:
 *   1. Read from storage
 *   2. Mutate the array
 *   3. Write back to storage
 *   4. Re-render the list
 *
 * Re-rendering the whole list on every change is simple and
 * fast enough for a personal to-do list. For very large lists
 * you would update only the changed element — but don't
 * optimise until you need to.
 */

function initTodo() {
  renderTodos();

  document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault(); // stop the form from reloading the page

    const input = document.getElementById('todo-input');
    const text  = input.value.trim();
    if (!text) return;

    const todos = Storage.get('dashboard_todos', []);
    // Date.now() gives milliseconds since the Unix epoch — a simple unique ID.
    todos.push({ id: Date.now(), text, completed: false });
    Storage.set('dashboard_todos', todos);

    input.value = '';
    renderTodos();
  });
}

function renderTodos() {
  const list  = document.getElementById('todo-list');
  const todos = Storage.get('dashboard_todos', []);

  if (todos.length === 0) {
    list.innerHTML = '<li class="muted" style="padding:0.5rem 0">No tasks yet. Add one above.</li>';
    return;
  }

  // Build the HTML string for all items using Array.map(),
  // then join the array into one string and set innerHTML.
  list.innerHTML = todos.map((todo) => `
    <li class="todo-item">
      <input
        type="checkbox"
        class="todo-check"
        data-id="${todo.id}"
        ${todo.completed ? 'checked' : ''}
        aria-label="Mark task complete"
      >
      <span class="todo-text ${todo.completed ? 'done' : ''}">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" data-id="${todo.id}" title="Delete task">&times;</button>
    </li>
  `).join('');

  // Attach event listeners AFTER setting innerHTML, because
  // innerHTML replaces existing elements (and their listeners) with new ones.
  list.querySelectorAll('.todo-check').forEach((checkbox) => {
    checkbox.addEventListener('change', () => toggleTodo(Number(checkbox.dataset.id)));
  });

  list.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteTodo(Number(btn.dataset.id)));
  });
}

function toggleTodo(id) {
  const todos = Storage.get('dashboard_todos', []);
  const todo  = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  Storage.set('dashboard_todos', todos);
  renderTodos();
}

function deleteTodo(id) {
  // Array.filter() returns a NEW array without the deleted item.
  // We never mutate the original data directly — this avoids subtle bugs.
  const todos = Storage.get('dashboard_todos', []).filter((t) => t.id !== id);
  Storage.set('dashboard_todos', todos);
  renderTodos();
}
