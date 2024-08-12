import pool from '../config/database.js';

const getChurchIdForUser = async (userId) => {
    const [rows] = await pool.query('SELECT church_id FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    return rows[0].church_id;
};

const saveFileData = async ({userId, churchId, url, type}) => {
    const [result] = await pool.query(
        'INSERT INTO resources (user_id, church_id, url, type) VALUES (?, ?, ?, ?)',
        [userId, churchId, url, type]
    );
    return result.insertId;
};

const updateUserProfilePicture = async (userId, resourceId) => {
    await pool.query(
        'UPDATE users SET profile_picture_id = ? WHERE id = ?',
        [resourceId, userId]
    );
};

const updateChurchProfilePicture = async (church_id, resourceId) => {
    await pool.query(
        'UPDATE churches SET church_profile_picture_id = ? WHERE id = ?',
        [resourceId, church_id]
    );
}

const addPostResource = async (postId, resourceId, groupId) => {
    await pool.query(
        'INSERT INTO posts_resources (post_id, resource_id, group_id) VALUES (?, ?, ?)',
        [postId, resourceId, groupId]
    );
};

export default {
    getChurchIdForUser,
    saveFileData,
    updateUserProfilePicture,
    updateChurchProfilePicture,
    addPostResource
};
