const crypto = require('crypto');

// In-memory data store for to-dos
let todos = [];

const todoModel = {
    /**
     * Get all to-dos
     * @returns {Array} Array of to-do objects
     */
    getAll: () => {
        return todos;
    },

    /**
     * Get a single to-do by ID
     * @param {string} id - The to-do ID
     * @returns {Object|undefined} The to-do object or undefined if not found
     */
    getById: (id) => {
        return todos.find((todo) => todo.id === id);
    },

    /**
     * Create a new to-do
     * @param {Object} data - To-do data { title: string, completed?: boolean }
     * @returns {Object} The created to-do
     */
    create: (data) => {
        const newTodo = {
            id: crypto.randomUUID(),
            title: data.title,
            completed: data.completed || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        todos.push(newTodo);
        return newTodo;
    },

    /**
     * Update an existing to-do
     * @param {string} id - The to-do ID 
     * @param {Object} data - Updated data
     * @returns {Object|null} The updated to-do, or null if not found
     */
    update: (id, data) => {
        const index = todos.findIndex((todo) => todo.id === id);
        if (index === -1) {
            return null;
        }

        const updatedTodo = {
            ...todos[index],
            ...data,
            id, // ensure ID cannot be changed
            updatedAt: new Date().toISOString()
        };

        todos[index] = updatedTodo;
        return updatedTodo;
    },

    /**
     * Delete a to-do by ID
     * @param {string} id - The to-do ID
     * @returns {boolean} True if deleted, false if not found
     */
    delete: (id) => {
        const initialLength = todos.length;
        todos = todos.filter((todo) => todo.id !== id);
        return todos.length < initialLength;
    }
};

module.exports = todoModel;
