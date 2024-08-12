import pool from '../config/database.js';

const createPost = async (postData) => {
    const {
        title,
        text,
        time_start,
        time_end,
        date_start,
        date_end,
        post_type,
        church_id,
        user_id,
    } = postData;

    const query = `
        INSERT INTO posts (title, text, time_start, time_end, date_start, date_end, post_type, church_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
        title, text, time_start, time_end, date_start, date_end, post_type, church_id, user_id
    ]);
    return result.insertId;
};

const getChurchIdByUserId = async (userId) => {
    const query = `
        SELECT church_id FROM users WHERE id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    if (rows.length === 0) {
        throw new Error(`User with id ${userId} not found`);
    }
    return rows[0].church_id;
};

const getPostTypeIdByName = async (postTypeName) => {
    const query = `
        SELECT id FROM post_types WHERE post_type_name = ?
    `;
    const [rows] = await pool.query(query, [postTypeName]);
    if (rows.length === 0) {
        throw new Error(`Post type ${postTypeName} not found`);
    }
    return rows[0].id;
};

const getAllPosts = async (churchId) => {
    const query = `
        SELECT 
            p.id, 
            p.title, 
            p.text, 
            p.time_start, 
            p.time_end, 
            p.date_start, 
            p.date_end, 
            p.created_at,
            pt.post_type_name, 
            p.church_id, 
            p.user_id,
            u.username,
            r.url AS profile_picture_url
        FROM posts p
        JOIN post_types pt ON p.post_type = pt.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id 
        WHERE p.church_id = ?
        ORDER BY p.id DESC
    `;
    const [rows] = await pool.query(query, [churchId]);
    return rows;
};

const getEvents = async (churchId) => {
    const query = `
    SELECT 
        p.id, 
        p.title, 
        p.text, 
        p.time_start, 
        p.time_end, 
        p.date_start, 
        p.date_end, 
        p.created_at,
        pt.post_type_name, 
        p.church_id, 
        p.user_id,
        u.username,
        r.url AS profile_picture_url
    FROM posts p
    JOIN post_types pt ON p.post_type = pt.id
    JOIN users u ON p.user_id = u.id
    LEFT JOIN resources r ON u.profile_picture_id = r.id 
    WHERE p.church_id = ?
      AND pt.post_type_name = 'Event' OR pt.post_type_name = 'Service'
    ORDER BY p.id DESC
`;
    const [rows] = await pool.query(query, [churchId]);
    return rows;
}


const getPostById = async (postId) => {
    const query = `
        SELECT 
            p.id, 
            p.title, 
            p.text, 
            p.time_start, 
            p.time_end, 
            p.date_start, 
            p.date_end, 
            pt.post_type_name, 
            p.church_id, 
            p.user_id,
            u.username,
            r.url AS profile_picture_url
        FROM posts p
        JOIN post_types pt ON p.post_type = pt.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE p.id = ?
    `;
    const [rows] = await pool.query(query, [postId]);
    if (rows.length === 0) {
        throw new Error(`Post with id ${postId} not found`);
    }
    return rows[0];
};


const deletePost = async (postId) => {
    const query = `
        DELETE FROM posts WHERE id = ?
    `;
    const [result] = await pool.query(query, [postId]);
    if (result.affectedRows === 0) {
        throw new Error(`Post with id ${postId} not found`);
    }
};

const updatePost = async (postId, postData) => {
    const {title, text, time_start, time_end, date_start, date_end, post_type, church_id, user_id} = postData;

    const query = `
        UPDATE posts
        SET title = ?, text = ?, time_start = ?, time_end = ?, date_start = ?, date_end = ?, post_type = ?, church_id = ?, user_id = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(query, [
        title, text, time_start, time_end, date_start, date_end, post_type, church_id, user_id, postId
    ]);
    if (result.affectedRows === 0) {
        throw new Error(`Post with id ${postId} not found`);
    }
};

const getAllUsersByChurchId = async (churchId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM users u
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE u.church_id = ?
    `;
    const [rows] = await pool.query(query, [churchId]);
    return rows;
};

const searchPostsByName = async (query) => {
    const searchQuery = `
        SELECT * FROM posts 
        WHERE title LIKE ?
    `;
    const [rows] = await pool.query(searchQuery, [`%${query}%`]);
    return rows;
};

export default {
    createPost,
    getChurchIdByUserId,
    getPostTypeIdByName,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
    getEvents,
    getAllUsersByChurchId,
    searchPostsByName
};
