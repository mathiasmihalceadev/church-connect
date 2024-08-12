import pool from '../config/database.js';
import qrcode from "qrcode";

const getUserById = async (userId) => {
    const query = `
        SELECT * FROM users WHERE id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows[0];
};

const getUserRoleName = async (roleId) => {
    const query = `
        SELECT user_role_name FROM user_roles WHERE id = ?
    `;
    const [rows] = await pool.query(query, [roleId]);
    return rows[0].user_role_name;
};

const getProfilePictureUrl = async (userId) => {
    const [userRows] = await pool.query('SELECT profile_picture_id FROM users WHERE id = ?', [userId]);
    const profilePictureId = userRows[0].profile_picture_id;

    if (!profilePictureId) {
        throw new Error('User does not have a profile picture');
    }

    const [pictureRows] = await pool.query('SELECT url FROM resources WHERE id = ?', [profilePictureId]);
    return pictureRows[0].url;
};

const updateUser = async (userId, userData) => {
    const columns = Object.keys(userData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(userData);

    const [result] = await pool.query(`UPDATE users SET ${columns} WHERE id = ?`, [...values, userId]);

    if (result.affectedRows === 0) {
        throw new Error('User not found');
    }

    return getUserById(userId);
};

const createUser = async ({validation_code, first_name, last_name, user_role, church_id, status}) => {
    const query = `
        INSERT INTO users (validation_code, first_name, last_name, user_role, church_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [validation_code, first_name, last_name, user_role, church_id, status]);
    return getUserById(result.insertId);
};

const addUserToGroups = async (userId, groupIds) => {
    const query = `
        INSERT INTO user_groups (user_id, group_id)
        VALUES ?
    `;
    const values = groupIds.map(groupId => [userId, groupId]);
    await pool.query(query, [values]);
};

const getUserRoleIdByName = async (roleName) => {
    const query = `
        SELECT id FROM user_roles WHERE user_role_name = ?
    `;
    const [rows] = await pool.query(query, [roleName]);
    if (rows.length === 0) {
        throw new Error(`Role name ${roleName} not found`);
    }
    return rows[0].id;
};

const getGroupIdsByNames = async (groupNames) => {
    const query = `
        SELECT id FROM groups WHERE name IN (?)
    `;
    const [rows] = await pool.query(query, [groupNames]);
    if (rows.length === 0) {
        throw new Error(`One or more group names not found`);
    }
    return rows.map(row => row.id);
};

const getChurchIdByAdminId = async (adminId) => {
    const query = `
        SELECT church_id FROM users WHERE id = ?
    `;
    const [rows] = await pool.query(query, [adminId]);
    if (rows.length === 0) {
        throw new Error(`Admin with id ${adminId} not found`);
    }
    return rows[0].church_id;
};

const getPendingUsers = async (churchId) => {
    const query = `
        SELECT u.id, u.validation_code, u.first_name, u.last_name, ur.user_role_name AS user_role 
        FROM users u
        JOIN user_roles ur ON u.user_role = ur.id
        WHERE u.status = 'pending' AND u.church_id = ?
    `;
    const [rows] = await pool.query(query, [churchId]);
    return rows;
};

const getUserIdByValidationCode = async (code) => {
    const query = `
        SELECT id 
        FROM users 
        WHERE validation_code = ?
    `;
    const [rows] = await pool.query(query, [code]);
    if (rows.length === 0) {
        throw new Error(`Validation code ${code} not found`);
    }
    return rows[0].id;
};

const generateAndStoreQRCode = async (userId, validationCode) => {
    // Generate QR code
    const qrData = `user_id:${userId},code:${validationCode}`;
    const qrCodeImage = await qrcode.toDataURL(qrData);


    // Store QR code in the database
    const query = 'UPDATE users SET qr_code = ? WHERE id = ?';
    await pool.query(query, [qrCodeImage, userId]);

    console.log(`QR code generated and stored for user ID: ${userId}`);
};

const deleteUser = async (userId) => {
    const query = `
        DELETE FROM users
        WHERE id = ?
    `;
    await pool.query(query, [userId]);
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

const getUsersByChurchIdPaginated = async (churchId, offset, limit) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.username, u.email, r.url AS profile_picture_url
        FROM users u
        LEFT JOIN resources r ON u.profile_picture_id = r.id
        WHERE u.church_id = ?
        LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [churchId, limit, offset]);

    const countQuery = `
        SELECT COUNT(*) as total
        FROM users
        WHERE church_id = ?
    `;
    const [countRows] = await pool.query(countQuery, [churchId]);
    const total = countRows[0].total;

    return {rows, total};
};

const getUsersByGroupId = async (groupId) => {
    const query = `
        SELECT 
            u.id, 
            u.first_name, 
            u.last_name, 
            u.username, 
            r.url AS profile_picture_url
        FROM 
            users u
        JOIN 
            user_groups ug ON u.id = ug.user_id
        LEFT JOIN 
            resources r ON u.profile_picture_id = r.id
        WHERE 
            ug.group_id = ?
    `;
    const [rows] = await pool.query(query, [groupId]);
    return rows;
};

const getUserIdsByUsernames = async (usernames) => {
    const [rows] = await pool.query('SELECT id FROM users WHERE username IN (?)', [usernames]);
    return rows.map(row => row.id);
};

const getUserByValidationCode = async (validationCode) => {
    const query = `
        SELECT id FROM users WHERE validation_code = ?
    `;
    const [rows] = await pool.query(query, [validationCode]);
    return rows[0];
};

export default {
    getUserById,
    getProfilePictureUrl,
    updateUser,
    createUser,
    addUserToGroups,
    getUserRoleName,
    getUserRoleIdByName,
    getGroupIdsByNames,
    getChurchIdByAdminId,
    getPendingUsers,
    getUserIdByValidationCode,
    generateAndStoreQRCode,
    deleteUser,
    getAllUsersByChurchId,
    getUsersByChurchIdPaginated,
    getUsersByGroupId,
    getUserIdsByUsernames,
    getUserByValidationCode
};
