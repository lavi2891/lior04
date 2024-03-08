"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVacation = exports.editVacation = exports.addVacation = exports.getImage = exports.getVacations = void 0;
const db_1 = __importDefault(require("../db")); // Import your database connection module
const path_1 = __importDefault(require("path"));
const default_image = "https://img.freepik.com/free-photo/beautiful-tropical-beach-sea-with-chair-blue-sky_74190-7488.jpg";
// Controller function to get vacations with pagination
const getVacations = async (req, res) => {
    const session = req.session;
    const user_id = "1"; // session.user_id; // Assuming you have the user's ID in the session
    console.log('vacationController.ts, 11, getVacations', session);
    if (!user_id)
        return res.status(401).json({ error: 'Unauthorized' });
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;
    try {
        const vacations = await db_1.default.query(`
        SELECT v.*, 
        COUNT(f.user_id) AS followers_count,
        EXISTS (SELECT 1 FROM followers f WHERE f.vacation_id = v.vacation_id AND f.user_id = ?) AS is_following
        FROM vacations v
        LEFT JOIN followers f ON v.vacation_id = f.vacation_id
        GROUP BY v.vacation_id
        LIMIT ${pageSize} OFFSET ${offset}`, [user_id]);
        res.json(vacations.map(({ image_file_name, ...vacation }) => ({ image_file_name: image_file_name ?? default_image, ...vacation })));
    }
    catch (error) {
        console.error('Error fetching vacations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getVacations = getVacations;
const getImage = async (req, res) => {
    let imagePath = default_image;
    if (typeof req.query.path === 'string') {
        imagePath = req.query.path;
    }
    const safePath = path_1.default.normalize(imagePath).replace(/^(\.\.[\/\\])+/, '');
    const absolutePath = path_1.default.resolve(__dirname, '../../', safePath);
    res.sendFile(absolutePath, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error occurred while trying to serve the image.');
        }
    });
};
exports.getImage = getImage;
// Controller function to add a new vacation
const addVacation = async (req, res) => {
    const { destination, description, start_date, end_date, price, image_file_name } = req.body;
    try {
        // Validate the input data (you should implement validation logic here)
        // Construct the SQL query for insertion
        const insertQuery = 'INSERT INTO vacations (destination, description, start_date, end_date, price, image_file_name) VALUES (?, ?, ?, ?, ?, ?)';
        // Execute the query and pass the values as an array
        const result = await db_1.default.query(insertQuery, [
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
        }
        else {
            res.status(500).json({ error: 'Failed to add vacation' });
        }
    }
    catch (error) {
        console.error('Error adding vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.addVacation = addVacation;
// Controller function to edit an existing vacation
const editVacation = async (req, res) => {
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
        const [result] = await db_1.default.query(updateQuery, [
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
        }
        else {
            // Vacation with the specified ID was not found
            res.status(404).json({ error: 'Vacation not found' });
        }
    }
    catch (error) {
        console.error('Error updating vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.editVacation = editVacation;
// Controller function to delete a vacation
const deleteVacation = async (req, res) => {
    const vacationId = req.params.id;
    try {
        // Execute a SQL query to delete the vacation based on vacationId
        const deleteQuery = 'DELETE FROM vacations WHERE vacationId = ?';
        const [result] = await db_1.default.query(deleteQuery, [vacationId]);
        // Check if any rows were affected by the delete operation
        if (result.affectedRows === 1) {
            // Vacation was successfully deleted
            res.json({ message: 'Vacation deleted successfully' });
        }
        else {
            // Vacation with the specified ID was not found
            res.status(404).json({ error: 'Vacation not found' });
        }
    }
    catch (error) {
        console.error('Error deleting vacation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteVacation = deleteVacation;
