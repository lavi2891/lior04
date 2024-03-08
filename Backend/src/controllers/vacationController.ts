import { Request, Response } from 'express';
import { ResultSetHeader, } from 'mysql2/promise';
import { Session } from 'express-session';
import db from '../db'; // Import your database connection module
import path from 'path';

interface Vacation {
    vacation_id: number
    name: string
    start_date: Date
    end_date: Date
    followers_count: number
    is_following: boolean
    description: string
    destination: string
    image_file_name: string
    price: string
}

const default_image = "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea-with-chair-blue-sky_74190-7488.jpg"

// Controller function to get vacations with pagination
export const getVacations = async (req: Request, res: Response) => {
    const session = req.session as unknown as Session;
    const user_id = "1" // session.user_id; // Assuming you have the user's ID in the session
    const onlyFollowing: boolean = req.query.onlyFollowing === 'true';
    console.log('vacationController.ts, 11, getVacations', session)
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    try {
        const vacations: Vacation[] = await db.query(`
        SELECT v.*, 
        COUNT(f.user_id) AS followers_count,
        EXISTS (SELECT 1 FROM followers f WHERE f.vacation_id = v.vacation_id AND f.user_id = ?) AS is_following
        FROM vacations v
        LEFT JOIN followers f ON v.vacation_id = f.vacation_id
        ${onlyFollowing ? 'WHERE EXISTS (SELECT 1 FROM followers f WHERE f.vacation_id = v.vacation_id AND f.user_id = ?)' : ''}
        GROUP BY v.vacation_id
        ORDER BY v.start_date ASC
        LIMIT ${pageSize} OFFSET ${offset}`, [user_id]);

        res.json(vacations.map(({ image_file_name, ...vacation }) => ({ image_file_name: image_file_name ?? default_image, ...vacation })));
    } catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getImage = async (req: Request, res: Response) => {
    let imagePath: string = default_image;
    if (typeof req.query.path === 'string') {
        imagePath = req.query.path;
    }
    const safePath = path.normalize(imagePath).replace(/^(\.\.[\/\\])+/, '');
    const absolutePath = path.resolve(__dirname, '../../', safePath);

    res.sendFile(absolutePath, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error occurred while trying to serve the image.');
        }
    });
};

// Controller function to add a new vacation
export const addVacation = async (req: Request, res: Response) => {
    const { destination, description, start_date, end_date, price, image_file_name } = req.body;

    try {
        // Validate the input data (you should implement validation logic here)

        // Construct the SQL query for insertion
        const insertQuery =
            'INSERT INTO vacations (destination, description, start_date, end_date, price, image_file_name) VALUES (?, ?, ?, ?, ?, ?)';

        // Execute the query and pass the values as an array
        const result: any = await db.query<ResultSetHeader>(insertQuery, [
            destination,
            description,
            start_date,
            end_date,
            price,
            image_file_name,
        ]);
        console.log(result);

        // Check if the insertion was successful (affectedRows should be 1)
        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Vacation added successfully' });
        } else {
            res.status(500).json({ error: 'Failed to add vacation' });
        }
    } catch (error) {
        console.error('Error adding vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to edit an existing vacation
export const editVacation = async (req: Request, res: Response) => {
    const vacationId = req.params.id;
    const { destination, description, start_date, end_date, price, image_file_name } = req.body;

    try {
        // Validate the input data (you should implement validation logic here)

        // Construct the SQL query for updating the vacation
        const updateQuery = `
        UPDATE vacations
        SET
          destination = ?,
          description = ?,
          start_date = ?,
          end_date = ?,
          price = ?,
          image_file_name = ?
        WHERE vacationId = ?
      `;

        // Execute the query and pass the values as an array
        const [result] = await db.query<ResultSetHeader>(updateQuery, [
            destination,
            description,
            start_date,
            end_date,
            price,
            image_file_name,
            vacationId, // vacationId from req.params
        ]);

        // Check if the update was successful (affectedRows should be 1)
        if (result.affectedRows === 1) {
            res.json({ message: 'Vacation updated successfully' });
        } else {
            // Vacation with the specified ID was not found
            res.status(404).json({ error: 'Vacation not found' });
        }
    } catch (error) {
        console.error('Error updating vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to delete a vacation
export const deleteVacation = async (req: Request, res: Response) => {
    const vacationId = req.params.id;

    try {
        // Execute a SQL query to delete the vacation based on vacationId
        const deleteQuery = 'DELETE FROM vacations WHERE vacationId = ?';
        const [result] = await db.query<ResultSetHeader>(deleteQuery, [vacationId]);

        // Check if any rows were affected by the delete operation
        if (result.affectedRows === 1) {
            // Vacation was successfully deleted
            res.json({ message: 'Vacation deleted successfully' });
        } else {
            // Vacation with the specified ID was not found
            res.status(404).json({ error: 'Vacation not found' });
        }
    } catch (error) {
        console.error('Error deleting vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};