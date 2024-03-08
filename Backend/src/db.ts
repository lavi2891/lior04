import { createPool, Pool, PoolOptions, RowDataPacket } from 'mysql2/promise';

// Create a pool of database connections
const dbConfig: PoolOptions = {
    host: 'localhost',
    user: 'root',
    password: 'alIo*(uu)9u((JJ)',
    database: 'task04',
};

const pool: Pool = createPool(dbConfig);

// Function to query the database
async function query<T>(sql: string, values?: any[]): Promise<T[]> {
    const [rows] = await pool.execute(sql, values);
    return rows as T[];
}

export default {
    query,
};
