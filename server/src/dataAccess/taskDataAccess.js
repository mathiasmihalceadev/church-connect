import pool from '../config/database.js';

export const getTasksByPostIdAndGroupId = async (postId, groupId) => {
    const query = `
        SELECT t.*, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM tasks t
        JOIN users u ON t.user_id = u.id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE t.post_id = ? AND t.group_id = ? 
    `;
    const [rows] = await pool.query(query, [postId, groupId]);
    return rows;
};

const createTask = async (postId, taskName, groupId, userId) => {
    const query = `
        INSERT INTO tasks (name, post_id, created_at, group_id, user_id)
        VALUES (?, ?, NOW(), ?, ?)
    `;
    const [result] = await pool.query(query, [taskName, postId, groupId, userId]);
    return result.insertId;
};

const assignUserToTask = async (taskId, userId) => {
    const query = `
        INSERT INTO task_users (task_id, user_id, has_seen)
        VALUES (?, ?, 0)
    `;
    await pool.query(query, [taskId, userId]);
};

const getUsersByTaskId = async (taskId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM users u
        JOIN task_users tu ON u.id = tu.user_id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE tu.task_id = ?
    `;
    const [rows] = await pool.query(query, [taskId]);
    return rows;
};

const deleteUsersByTaskId = async (taskId) => {
    const query = 'DELETE FROM task_users WHERE task_id = ?';
    await pool.query(query, [taskId]);
};

const deleteTaskById = async (taskId) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    await pool.query(query, [taskId]);
};

const unassignUserFromTask = async (taskId, userId) => {
    const query = `
        DELETE FROM task_users
        WHERE task_id = ? AND user_id = ?
    `;
    await pool.query(query, [taskId, userId]);
};

const setUserHasSeen = async (taskId, userId) => {
    const query = `
        UPDATE task_users
        SET has_seen = 1
        WHERE task_id = ? AND user_id = ?
    `;
    await pool.query(query, [taskId, userId]);
};

const setUserHasUnseen = async (taskId, userId) => {
    const query = `
        UPDATE task_users
        SET has_seen = 0
        WHERE task_id = ? AND user_id = ?
    `;
    await pool.query(query, [taskId, userId]);
};

const checkUserAssignmentSeen = async (taskId, userId) => {
    const query = `
        SELECT COUNT(*) AS count 
        FROM task_users 
        WHERE task_id = ? AND user_id = ? AND has_seen = 0
    `;
    const [rows] = await pool.query(query, [taskId, userId]);
    return rows[0].count > 0;
};

const getUnassignedUsers = async (groupId, taskId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM users u
        JOIN user_groups ug ON u.id = ug.user_id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        LEFT JOIN task_users tu ON u.id = tu.user_id AND tu.task_id = ?
        WHERE ug.group_id = ? AND tu.user_id IS NULL
    `;
    const [rows] = await pool.query(query, [taskId, groupId]);
    return rows;
};

const addUsersToTaskByUsername = async (taskId, usernames) => {
    // Get user ids based on usernames
    const userQuery = 'SELECT id FROM users WHERE username IN (?)';
    const [users] = await pool.query(userQuery, [usernames]);

    if (users.length === 0) {
        throw new Error("No users found with the provided usernames");
    }

    const userIds = users.map(user => user.id);

    // Insert into task_users
    const taskUserQuery = 'INSERT INTO task_users (task_id, user_id) VALUES (?, ?)';

    for (const userId of userIds) {
        await pool.query(taskUserQuery, [taskId, userId]);
    }
};

export default {
    getTasksByPostIdAndGroupId,
    createTask,
    assignUserToTask,
    getUsersByTaskId,
    deleteTaskById,
    deleteUsersByTaskId,
    unassignUserFromTask,
    setUserHasSeen,
    setUserHasUnseen,
    checkUserAssignmentSeen,
    getUnassignedUsers,
    addUsersToTaskByUsername
};
