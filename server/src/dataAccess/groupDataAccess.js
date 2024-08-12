import pool from '../config/database.js';

const getAllGroups = async (churchId) => {
    const [rows] = await pool.query('SELECT name, id FROM groups WHERE church_id = ?', [churchId]);
    return rows;
};

const getChurchId = async (userId) => {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    return users[0].church_id;
};

const addUserToGroups = async (userId, groupId) => {
    const query = `
        INSERT INTO user_groups (user_id, group_id)
        VALUES (?, ?)
    `
    await pool.query(query, [userId, groupId]);
};

const getGroupsByUserId = async (userId) => {
    const query = `
        SELECT g.id, g.name
        FROM groups g
        JOIN user_groups ug ON g.id = ug.group_id
        WHERE ug.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
};

const editUserGroups = async (userId, groupIds) => {
    const deleteQuery = `
        DELETE FROM user_groups
        WHERE user_id = ?
    `;
    await pool.query(deleteQuery, [userId]);

    await addUserToGroups(userId, groupIds);
};

const removeUserFromGroup = async (userId, groupId) => {
    const query = `
        DELETE FROM user_groups
        WHERE user_id = ? AND group_id = ?
    `;
    await pool.query(query, [userId, groupId]);
};

const getUsersByGroupId = async (groupId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM users u
        JOIN user_groups ug ON u.id = ug.user_id
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE ug.group_id = ? AND u.status = 'active'
    `;
    const [rows] = await pool.query(query, [groupId]);
    return rows;
};


const getUsersNotInGroup = async (groupId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, r.url AS profile_picture_url
        FROM users u
        LEFT JOIN user_groups ug ON u.id = ug.user_id AND ug.group_id = ?
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE u.church_id = (
            SELECT g.church_id
            FROM groups g
            WHERE g.id = ?
        ) AND ug.group_id IS NULL
    `;
    const [rows] = await pool.query(query, [groupId, groupId]);
    return rows;
};


export default {
    getAllGroups,
    getChurchId,
    addUserToGroups,
    getGroupsByUserId,
    editUserGroups,
    removeUserFromGroup,
    getUsersByGroupId,
    getUsersNotInGroup
};
