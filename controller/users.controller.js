const userModel = require('../models/users.models'); // Adjust path as needed

const userController = {
    // Get all users
    getAll: async (req, res) => {
        try {
            const users = await userModel.getAll();
            res.json(users);
        } catch (error) {
            console.error('Error fetching all users:', error);
            res.status(500).json({ error: 'Failed to fetch users.' });
        }
    },

    // Get a user by ID
    getById: async (req, res) => {
        try {
            const user = await userModel.getUserById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error(`Error fetching user with ID ${req.params.id}:`, error);
            res.status(500).json({ error: 'Failed to fetch user.' });
        }
    },

    // Create a new user
    create: async (req, res) => {
        try {
            const { name, email, password, user_type } = req.body;
            if (!name || !email || !password || !user_type) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            const userId = await userModel.createUser([name, email, password, user_type]);
            res.status(201).json({ message: 'User created successfully.', userId });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user.' });
        }
    },

    // Update a user by ID
    update: async (req, res) => {
        try {
            const { name, email, password, user_type } = req.body;
            const updatedUser = { name, email, password, user_type };
            const success = await userModel.updateUser(req.params.id, updatedUser);

            if (success) {
                res.json({ message: 'User updated successfully.' });
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error(`Error updating user with ID ${req.params.id}:`, error);
            res.status(500).json({ error: 'Failed to update user.' });
        }
    },

    // Delete a user by ID
    delete: async (req, res) => {
        try {
            const success = await userModel.deleteUser(req.params.id);
            if (success) {
                res.json({ message: 'User deleted successfully.' });
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error(`Error deleting user with ID ${req.params.id}:`, error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }
};

module.exports = userController;

