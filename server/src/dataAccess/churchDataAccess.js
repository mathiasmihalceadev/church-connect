import pool from '../config/database.js';

const getAllChurches = async () => {
    const [rows] = await pool.query('SELECT * FROM churches');
    return rows;
};

const createChurch = async (name, handle, denomination, address, country, city, region, postalCode, phoneNumber, email, website, congregation, history) => {
    const [result] = await pool.query('INSERT INTO churches (church_name, church_handle, denomination, church_address, church_country, church_city, church_region, church_postal_code, church_phone_number, church_email, church_website, church_congregation, church_history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, handle, denomination, address, country, city, region, postalCode, phoneNumber, email, website, congregation, history]);
    return result.insertId;
};

const getChurchBy = async (data, column) => {
    const [rows] = await pool.query(`SELECT * FROM churches WHERE ${column} = ?`, [data]);
    return rows[0];
};

const getChurchByUserId = async (userId) => {
    const churchId = await getChurchId(userId);
    const church = await getChurch(churchId);
    const members = await getMembers(churchId);
    return {...church, members: members};
};

const getChurchId = async (userId) => {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    return users[0].church_id;
};

const getChurch = async (churchId) => {
    const [churches] = await pool.query('SELECT * FROM churches WHERE id = ?', [churchId]);
    return churches[0];
};

const getMembers = async (churchId) => {
    const [users] = await pool.query("SELECT * FROM users WHERE church_id = ? AND status = 'active'", [churchId]);
    return users.length;
};

const getProfilePictureUrl = async (churchId) => {
    const [userRows] = await pool.query('SELECT church_profile_picture_id FROM churches WHERE id = ?', [churchId]);
    const profilePictureId = userRows[0].church_profile_picture_id;

    if (!profilePictureId) {
        throw new Error('User does not have a profile picture');
    }

    const [pictureRows] = await pool.query('SELECT url FROM resources WHERE id = ?', [profilePictureId]);
    return pictureRows[0].url;
};

export default {
    getAllChurches,
    createChurch,
    getChurchBy,
    getChurchByUserId,
    getChurchId,
    getChurch,
    getMembers,
    getProfilePictureUrl
};
