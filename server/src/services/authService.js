import authDataAccess from '../dataAccess/authDataAccess.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import stream from "../utils/stream.js"
import userDataAccess from "../dataAccess/userDataAccess.js";

dotenv.config();

const registerAdminUser = async (email, password, role, lastName, firstName, username, churchId) => {
    const existingUserEmail = await authDataAccess.getUserBy(email, 'email');
    const existingUserUsername = await authDataAccess.getUserBy(username, 'username');

    if (existingUserEmail || existingUserUsername) {
        throw new Error('User already exists');
    }

    const userId = await authDataAccess.createAdminUser(email, password, role, lastName, firstName, username, churchId);
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '1h'});
};

const registerUser = async (email, password, username, userId) => {
    const existingUserEmail = await authDataAccess.getUserBy(email, 'email');
    const existingUserUsername = await authDataAccess.getUserBy(username, 'username');

    if (existingUserEmail || existingUserUsername) {
        throw new Error('User already exists');
    }

    await authDataAccess.createUser(email, password, username, userId);
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '1h'});
};

const loginUser = async (identifier, password) => {
    const userByEmail = await authDataAccess.getUserBy(identifier, 'email');
    const userByUsername = await authDataAccess.getUserBy(identifier, 'username');

    const user = userByEmail || userByUsername;

    if (!user) {
        throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '100h'});
    const streamToken = stream.generateStreamToken(user.id);

    return {token, streamToken};
};

const checkUserBy = async (data, columnName) => {
    const existingUser = await authDataAccess.getUserBy(data, columnName);
    return !!existingUser;
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

const checkValidationCode = async (validationCode) => {
    return await authDataAccess.getUserIdByValidationCode(validationCode);
};

export default {registerAdminUser, registerUser, loginUser, checkUserBy, verifyToken, checkValidationCode};
