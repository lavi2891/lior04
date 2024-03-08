import { Request, Response } from 'express';
import db from '../db'; // Adjust the path as needed
import { Blob } from 'buffer';


interface Vacation {
    vacation_id: number;
    destination: string;
}

interface VacationWithFollowers extends Vacation {
    followers_count: number;
}

// Function to make a user follow a vacation
export const followVacation = async (req: Request, res: Response) => {
    const { user_id, vacation_id } = req.body;
    console.log({ user_id, vacation_id }, req.body)
    try {
        // Check if the user is already following the vacation
        const isFollowing = await db.query('SELECT * FROM followers WHERE user_id = ? AND vacation_id = ?', [user_id, vacation_id]);

        if (isFollowing.length === 0) {
            // If the user is not following the vacation, insert a new record
            await db.query('INSERT INTO user_follows_vacation (user_id, vacation_id) VALUES (?, ?)', [user_id, vacation_id]);

            res.status(200).json({ message: 'User followed the vacation' });
        } else {
            res.status(400).json({ message: 'User is already following the vacation' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to follow the vacation' });
    }
};

// Function to make a user unfollow a vacation
export const unfollowVacation = async (req: Request, res: Response) => {
    const { user_id, vacation_id } = req.body;
    console.log({ user_id, vacation_id }, req.body)
    try {
        await db.query('DELETE FROM followers WHERE user_id = ? AND vacation_id = ?', [user_id, vacation_id]);

        res.status(200).json({ message: 'User unfollowed the vacation' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to unfollow the vacation' });
    }
};

export const getAllVacationsWithFollowers = async (req: Request, res: Response) => {
    try {
        const vacationsWithFollowers = await getAllVacationsWithFollowersData();

        res.status(200).json(vacationsWithFollowers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vacations with followers count' });
    }
};

export const downloadVacationsWithFollowersAsCsv = async (req: Request, res: Response) => {
    try {
        // Query the database to get all vacations with followers count
        const vacationsWithFollowers: VacationWithFollowers[] | undefined = await getAllVacationsWithFollowersData();
        if (!vacationsWithFollowers) {
            res.status(400).json('No vacations were found');
            return
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate and download the CSV file' });
    }
};


export const getAllVacationsWithFollowersData = async () => {
    try {
        // Query the database to get all vacations
        const vacations: Vacation[] = await db.query('SELECT vacation_id, destination FROM vacations');

        // Initialize an empty array to store results with followers count
        const vacationsWithFollowers: VacationWithFollowers[] = [];

        // Loop through the vacations and calculate followers count for each
        for (const vacation of vacations) {
            // Query the database to count followers for each vacation
            const followersCount: { count: number }[] = await db.query(
                'SELECT COUNT(*) as count FROM followers WHERE vacation_id = ?',
                [vacation.vacation_id]
            );

            // Push the vacation object with followers count to the result array
            vacationsWithFollowers.push({
                vacation_id: vacation.vacation_id,
                destination: vacation.destination,
                followers_count: followersCount?.[0]?.count ?? 0, // Assuming you get the count from the query result
            });
        }

        return vacationsWithFollowers;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch vacations with followers count');
    }
};