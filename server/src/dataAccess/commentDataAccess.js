import pool from '../config/database.js';

const getCommentsByPostId = async (postId) => {
    const query = `
        SELECT c.id, c.comment_text, c.post_id, c.user_id,
               u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE c.post_id = ?
        ORDER BY c.id DESC
    `;
    const [rows] = await pool.query(query, [postId]);
    return rows;
};

const postComment = async (postId, userId, comment_text) => {
    const query = `
        INSERT INTO comments (post_id, user_id, comment_text)
        VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(query, [postId, userId, comment_text]);
    const commentId = result.insertId;

    const comment = await getCommentById(commentId);
    return comment;
};

const getCommentById = async (commentId) => {
    const query = `
        SELECT c.id, c.comment_text, c.post_id, c.user_id,
               u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE c.id = ?
    `;
    const [rows] = await pool.query(query, [commentId]);
    return rows[0];
};

export default {getCommentsByPostId, postComment, getCommentById};
