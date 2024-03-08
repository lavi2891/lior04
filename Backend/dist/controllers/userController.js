"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../db")); // Adjust the path as needed
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const session = req.session;
    // Replace this with proper validation and error handling
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    const values = [email, password, 'User'];
    try {
        // Query the database to get the ID of the newly inserted user
        const result = await db_1.default.query(sql, values);
        // Get the user ID from the result
        const userId = result.insertId;
        session.user_id = userId;
        console.log('register', session);
        return res.status(200).json({ message: 'Registration successful' });
    }
    catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email address already in use' });
        }
        else {
            return res.status(500).json({ message: 'Registration failed' });
        }
    }
};
exports.registerUser = registerUser;
// Function for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const session = req.session;
    // Replace this with proper validation and error handling
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const values = [email, password];
    try {
        const users = await db_1.default.query(sql, values);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        session.user_id = users[0].user_id;
        console.log('login', session);
        return res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Login failed' });
    }
};
exports.loginUser = loginUser;
