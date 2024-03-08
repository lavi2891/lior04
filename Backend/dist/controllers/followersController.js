"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVacationsWithFollowersData = exports.downloadVacationsWithFollowersAsCsv = exports.getAllVacationsWithFollowers = exports.unfollowVacation = exports.followVacation = void 0;
const db_1 = __importDefault(require("../db")); // Adjust the path as needed
// Function to make a user follow a vacation
const followVacation = async (req, res) => {
    const { user_id, vacation_id } = req.body;
    console.log({ user_id, vacation_id }, req.body);
    try {
        // Check if the user is already following the vacation
        const isFollowing = await db_1.default.query('SELECT * FROM followers WHERE user_id = ? AND vacation_id = ?', [user_id, vacation_id]);
        if (isFollowing.length === 0) {
            // If the user is not following the vacation, insert a new record
            await db_1.default.query('INSERT INTO user_follows_vacation (user_id, vacation_id) VALUES (?, ?)', [user_id, vacation_id]);
            res.status(200).json({ message: 'User followed the vacation' });
        }
        else {
            res.status(400).json({ message: 'User is already following the vacation' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to follow the vacation' });
    }
};
exports.followVacation = followVacation;
// Function to make a user unfollow a vacation
const unfollowVacation = async (req, res) => {
    const { user_id, vacation_id } = req.body;
    console.log({ user_id, vacation_id }, req.body);
    try {
        await db_1.default.query('DELETE FROM followers WHERE user_id = ? AND vacation_id = ?', [user_id, vacation_id]);
        res.status(200).json({ message: 'User unfollowed the vacation' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to unfollow the vacation' });
    }
};
exports.unfollowVacation = unfollowVacation;
const getAllVacationsWithFollowers = async (req, res) => {
    try {
        const vacationsWithFollowers = await (0, exports.getAllVacationsWithFollowersData)();
        res.status(200).json(vacationsWithFollowers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vacations with followers count' });
    }
};
exports.getAllVacationsWithFollowers = getAllVacationsWithFollowers;
const downloadVacationsWithFollowersAsCsv = async (req, res) => {
    try {
        // Query the database to get all vacations with followers count
        const vacationsWithFollowers = await (0, exports.getAllVacationsWithFollowersData)();
        if (!vacationsWithFollowers) {
            res.status(400).json('No vacations were found');
            return;
        }
        // Create a CSV string
        let csvData = 'ID,Destination,Followers\n'; // Add header row
        for (const vacation of vacationsWithFollowers) {
            csvData += `${vacation.vacation_id},${vacation.destination},${vacation.followers_count}\n`;
        }
        // Create a blob from the CSV data
        const binaryData = Buffer.from(csvData, 'utf-8');
        res.setHeader('Content-Type', 'text/csv');
        const filename = encodeURI('vacations_with_followers.csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.end(binaryData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate and download the CSV file' });
    }
};
exports.downloadVacationsWithFollowersAsCsv = downloadVacationsWithFollowersAsCsv;
const getAllVacationsWithFollowersData = async () => {
    try {
        // Query the database to get all vacations
        const vacations = await db_1.default.query('SELECT vacation_id, destination FROM vacations');
        // Initialize an empty array to store results with followers count
        const vacationsWithFollowers = [];
        // Loop through the vacations and calculate followers count for each
        for (const vacation of vacations) {
            // Query the database to count followers for each vacation
            const followersCount = await db_1.default.query('SELECT COUNT(*) as count FROM followers WHERE vacation_id = ?', [vacation.vacation_id]);
            // Push the vacation object with followers count to the result array
            vacationsWithFollowers.push({
                vacation_id: vacation.vacation_id,
                destination: vacation.destination,
                followers_count: followersCount?.[0]?.count ?? 0, // Assuming you get the count from the query result
            });
        }
        return vacationsWithFollowers;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to fetch vacations with followers count');
    }
};
exports.getAllVacationsWithFollowersData = getAllVacationsWithFollowersData;
