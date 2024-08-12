import pool from '../config/database.js';

const recordAttendance = async (postId, userId) => {
    const checkQuery = `
        SELECT COUNT(*) AS count 
        FROM attendance 
        WHERE post_id = ? AND user_id = ?
    `;

    const [rows] = await pool.query(checkQuery, [postId, userId]);

    if (rows[0].count === 0) {
        const insertQuery = `
            INSERT INTO attendance (post_id, user_id)
            VALUES (?, ?)
        `;
        await pool.query(insertQuery, [postId, userId]);
    }
};

const getUserAttendance = async (userId) => {
    const query = `
        SELECT p.id, p.title, p.date_start, a.attended_at
        FROM attendance a
        JOIN posts p ON a.post_id = p.id
        WHERE a.user_id = ?
        ORDER BY a.attended_at DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
};

export default {
    recordAttendance, getUserAttendance
};