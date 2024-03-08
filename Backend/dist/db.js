"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
// Create a pool of database connections
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'alIo*(uu)9u((JJ)',
    database: 'task04',
};
const pool = (0, promise_1.createPool)(dbConfig);
// Function to query the database
async function query(sql, values) {
    const [rows] = await pool.execute(sql, values);
    return rows;
}
exports.default = {
    query,
};
