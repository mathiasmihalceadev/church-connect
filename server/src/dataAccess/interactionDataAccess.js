import pool from '../config/database.js';

const createInteraction = async (userId, postId) => {
    const query = `
        INSERT INTO interactions (user_id, post_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE interaction_time = CURRENT_TIMESTAMP
    `;
    const [result] = await pool.query(query, [userId, postId]);
    return result.insertId;
};

const deleteInteraction = async (userId, postId) => {
    const query = `
        DELETE FROM interactions
        WHERE user_id = ? AND post_id = ? 
    `;
    const [result] = await pool.query(query, [userId, postId]);
    return result.affectedRows;
};

const getUserInteraction = async (userId, postId) => {
    const query = `
        SELECT i.*, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM interactions i
        JOIN users u ON i.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE i.user_id = ? AND i.post_id = ?
    `;
    const [rows] = await pool.query(query, [userId, postId]);
    return rows[0];
};


const getUsersWhoInteractedWithPost = async (postId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url, i.interaction_type
        FROM interactions i
        JOIN users u ON i.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE i.post_id = ?
    `;
    const [rows] = await pool.query(query, [postId]);
    return rows;
};

export default {getUsersWhoInteractedWithPost, getUserInteraction, createInteraction, deleteInteraction};
