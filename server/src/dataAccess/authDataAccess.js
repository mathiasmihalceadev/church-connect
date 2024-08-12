import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import qrcode from "qrcode";

const createAdminUser = async (email, password, role, firstName, lastName, username, churchId) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleId = await getRoleIdByName(role);

    const [userResult] = await pool.query(
        'INSERT INTO users (email, password, last_name, first_name, username, user_role, church_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, lastName, firstName, username, roleId.id, churchId]
    );

    return userResult.insertId;
};

const createUser = async (email, password, username, userId) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
        'UPDATE users SET email = ?, password = ?, username = ?, status = "active" WHERE id = ?',
        [email, hashedPassword, username, userId]
    );

    return userResult.insertId;
};

const getUserBy = async (value, columnName) => {
    let rows;
    if (columnName === "validation_code") {
        [rows] = await pool.query(`SELECT * FROM users WHERE ${columnName} = ?`, [value]);
    } else {
        [rows] = await pool.query(`SELECT * FROM users WHERE ${columnName} = ? AND status="active"`, [value]);
    }
    return rows[0];
};

const getRoleIdByName = async (name) => {
    const [roleId] = await pool.query('SELECT id FROM user_roles WHERE user_role_name = ?', [name]);
    return roleId[0];
};

const getUserIdByValidationCode = async (validationCode) => {
    const query = `
        SELECT id FROM users WHERE validation_code = ?
    `;
    const [rows] = await pool.query(query, [validationCode]);
    if (rows.length === 0) {
        throw new Error(`Validation code ${validationCode} not found`);
    }
    return rows[0];
};

const generateAndStoreQRCode = async (userId, validationCode) => {
    // Generate QR code
    const qrData = `user_id:${userId},code:${validationCode}`;

    const qrCodeOptions = {
        errorCorrectionLevel: 'H',
        margin: 4,
        scale: 10
    };

    const qrCodeImage = await qrcode.toDataURL(qrData, qrCodeOptions);

    const query = 'UPDATE users SET qr_code = ? WHERE id = ?';
    await pool.query(query, [qrCodeImage, userId]);

    console.log(`QR code generated and stored for user ID: ${userId}`);
};


export default {
    createAdminUser,
    getUserBy,
    getRoleIdByName,
    getUserIdByValidationCode,
    createUser,
    generateAndStoreQRCode
};





