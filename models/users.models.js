// models/User.js
const db = require('./db');
const bcrypt = require('bcrypt');

// Utility function for hashing passwords
async function hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
}

// Get all users (admin-only functionality)
function getAll() {
    const sql = `SELECT id, created_at, name, email, user_type FROM Users;`;
    return db.query(sql); 
}

// Get a user by ID
function getUserById(id) {
    const sql = `SELECT id, created_at, name, email, user_type FROM Users WHERE id = ?;`;
    return db.get(sql, [id]);
}

// Get a user by email (used for login)
function getUserByEmail(email) {
    const sql = `SELECT * FROM Users WHERE email = ?;`;
    return db.get(sql, [email]); // Includes password for authentication
}

// Create a new user
async function createUser(name, email, plainTextPassword, userType = 'shopper') {
    const hashedPassword = await hashPassword(plainTextPassword);
    const sql = `
        INSERT INTO Users (name, email, password, user_type) 
        VALUES (?, ?, ?, ?);
    `;
    return db.run(sql, [name, email, hashedPassword, userType]);
}

// Update a user's details
function updateUser(id, updatedData) {
    const sql = `
        UPDATE Users 
        SET name = ?, email = ?, user_type = ? 
        WHERE id = ?;
    `;
    return db.run(sql, [
        updatedData.name,
        updatedData.email,
        updatedData.user_type,
        id
    ]);
}

// Delete a user by ID
function deleteUser(id) {
    const sql = `DELETE FROM Users WHERE id = ?;`;
    return db.run(sql, [id]);
}

// Verify a user's password (for login)
async function verifyPassword(email, plainTextPassword) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid password');
    }
    return user; // Return user details if password matches
}

module.exports = {
    getAll,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    verifyPassword
};
