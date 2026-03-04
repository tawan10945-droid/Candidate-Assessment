const todoModel = require('../models/todo');

const todoController = {
    
    getAllTodos: (req, res, next) => {
        try {
            const todos = todoModel.getAll();
            res.status(200).json(todos);
        } catch (error) {
            next(error);
        }
    },

    getTodoById: (req, res, next) => {
        try {
            const { id } = req.params;
            const todo = todoModel.getById(id);

            if (!todo) {
                return res.status(404).json({ error: 'To-do item not found' });
            }

            res.status(200).json(todo);
        } catch (error) {
            next(error);
        }
    },

    
    createTodo: (req, res, next) => {
        try {
            const { title, completed } = req.body;

            if (!title || typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
            }

            const newTodo = todoModel.create({ title: title.trim(), completed });
            res.status(201).json(newTodo);
        } catch (error) {
            next(error);
        }
    },

  
    updateTodo: (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, completed } = req.body;

            if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
                return res.status(400).json({ error: 'Title must be a non-empty string if provided' });
            }

            if (completed !== undefined && typeof completed !== 'boolean') {
                return res.status(400).json({ error: 'Completed must be a boolean' });
            }

            const updatedData = {};
            if (title !== undefined) updatedData.title = title.trim();
            if (completed !== undefined) updatedData.completed = completed;

            const updatedTodo = todoModel.update(id, updatedData);

            if (!updatedTodo) {
                return res.status(404).json({ error: 'To-do item not found' });
            }

            res.status(200).json(updatedTodo);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /todos/:id
    deleteTodo: (req, res, next) => {
        try {
            const { id } = req.params;
            const isDeleted = todoModel.delete(id);

            if (!isDeleted) {
                return res.status(404).json({ error: 'To-do item not found' });
            }

            res.status(200).json({ message: 'To-do item successfully deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = todoController;
