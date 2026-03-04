// Define the API URL and the required header
const API_URL = '/todos';
const HEADERS = {
    'Content-Type': 'application/json',
    'x-api-key': 'secret-index-key-123'
};

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');

// State
let todos = [];

// Initialize
document.addEventListener('DOMContentLoaded', fetchTodos);

// Event Listeners
todoForm.addEventListener('submit', handleAddTodo);

async function fetchTodos() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch(API_URL, { headers: HEADERS });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        todos = await response.json();
        renderTodos();
    } catch (error) {
        showError('Failed to load to-dos. Is the backend running?');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

async function handleAddTodo(e) {
    e.preventDefault();
    const title = todoInput.value.trim();

    if (!title) return;

    hideError();
    const btn = document.getElementById('add-btn');
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ title, completed: false })
        });

        if (!response.ok) throw new Error('Failed to create to-do');

        const newTodo = await response.json();
        todos.push(newTodo);
        renderTodos();
        todoInput.value = '';
    } catch (error) {
        showError('Could not add the task.');
        console.error(error);
    } finally {
        btn.disabled = false;
        todoInput.focus();
    }
}

async function toggleTodo(id, currentStatus) {
    // Optimistic UI update
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;

    const newStatus = !currentStatus;
    todos[todoIndex].completed = newStatus;
    renderTodos();

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify({ completed: newStatus })
        });

        if (!response.ok) throw new Error('Toggle failed');
        // Validation check against server response could go here
    } catch (error) {
        // Revert UI on failure
        todos[todoIndex].completed = currentStatus;
        renderTodos();
        showError('Failed to update task status.');
        console.error(error);
    }
}

async function deleteTodo(id) {
    // Optimistic UI update
    const previousTodos = [...todos];
    todos = todos.filter(t => t.id !== id);
    renderTodos();

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: HEADERS
        });

        if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
        // Revert UI on failure
        todos = previousTodos;
        renderTodos();
        showError('Failed to delete task.');
        console.error(error);
    }
}

// Rendering
function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<li style="justify-content: center; color: var(--text-muted); border: none; background: transparent;"><p>No tasks yet. Add one above!</p></li>';
        return;
    }

    // Sort: incomplete first, then ordered by creation time
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return a.completed ? 1 : -1;
    });

    sortedTodos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="todo-content">
                <div class="checkbox" onclick="toggleTodo('${todo.id}', ${todo.completed})"></div>
                <span class="todo-text" id="text-${todo.id}">${escapeHTML(todo.title)}</span>
                <input type="text" class="edit-input hidden" id="edit-${todo.id}" value="${escapeHTML(todo.title)}">
            </div>
            <div class="action-buttons">
                <button class="edit-btn" onclick="startEdit('${todo.id}')" id="btn-edit-${todo.id}" aria-label="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="save-btn hidden" onclick="saveEdit('${todo.id}')" id="btn-save-${todo.id}" aria-label="Save">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <button class="delete-btn" onclick="deleteTodo('${todo.id}')" aria-label="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

// Edit functionality
function startEdit(id) {
    const textSpan = document.getElementById(`text-${id}`);
    const editInput = document.getElementById(`edit-${id}`);
    const editBtn = document.getElementById(`btn-edit-${id}`);
    const saveBtn = document.getElementById(`btn-save-${id}`);

    textSpan.classList.add('hidden');
    editInput.classList.remove('hidden');
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');

    editInput.focus();
    // Move cursor to end of text
    editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
}

async function saveEdit(id) {
    const editInput = document.getElementById(`edit-${id}`);
    const newTitle = editInput.value.trim();

    if (!newTitle) {
        showError('Title cannot be empty');
        return;
    }

    // Find the current todo
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;

    // Keep original title in case of failure
    const originalTitle = todos[todoIndex].title;

    // Optimistic UI update
    todos[todoIndex].title = newTitle;
    renderTodos();

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify({ title: newTitle })
        });

        if (!response.ok) throw new Error('Update failed');
    } catch (error) {
        // Revert on failure
        todos[todoIndex].title = originalTitle;
        renderTodos();
        showError('Failed to update task title.');
        console.error(error);
    }
}

// Utils
function showLoading(show) {
    if (show) loadingEl.classList.remove('hidden');
    else loadingEl.classList.add('hidden');
}

function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
}

function hideError() {
    errorEl.classList.add('hidden');
}

function escapeHTML(str) {
    // Basic XSS protection
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
