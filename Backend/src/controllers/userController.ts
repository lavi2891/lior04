import { Request, Response } from 'express';
import db from '../db'; // Adjust the path as needed
import { Session } from 'express-session';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const session = req.session as unknown as Session;
  // Replace this with proper validation and error handling
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
  const values = [email, password, 'User'];

  try {
    // Query the database to get the ID of the newly inserted user
    const result: any = await db.query(sql, values);
    // Get the user ID from the result
    const userId = result.insertId
    session.user_id = userId
    console.log('register', session);
    return res.status(200).json({ message: 'Registration successful' });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email address already in use' });
    } else {
      return res.status(500).json({ message: 'Registration failed' });
    }
  }
};

// Function for user login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const session = req.session as unknown as Session;

  // Replace this with proper validation and error handling
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  const values = [email, password];

  try {
    const users: any[] = await db.query(sql, values);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    session.user_id = users[0].user_id;
    console.log('login', session);
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
};