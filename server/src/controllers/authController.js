import authService from '../services/authService.js';
import stream from '../utils/stream.js';
import userService from "../services/userService.js";


const registerAdmin = async (req, res) => {
    const {email, password, role, lastName, firstName, username, churchId} = req.body;

    try {
        const token = await authService.registerAdminUser(email, password, role, lastName, firstName, username, churchId);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(201).json({token});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const registerUser = async (req, res) => {
    const {email, password, username, userId} = req.body;

    try {
        const token = await authService.registerUser(email, password, username, userId.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(201).json({token});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const login = async (req, res) => {
    const {identifier, password} = req.body;

    try {
        const {token, streamToken} = await authService.loginUser(identifier, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(200).json({token, streamToken, message: "Logged in successfully"});
    } catch (error) {
        res.status(401).json({message: error.message});
    }
};

const logout = async (req, res) => {
    res.clearCookie('token', {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict'});
    res.status(200).json({message: 'Logged out successfully'});
};

const checkUser = async (req, res) => {
    const {data, columnName} = req.body;

    try {
        const userExists = await authService.checkUserBy(data, columnName);
        res.status(201).json({exists: userExists});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const authCheck = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({loggedIn: false, message: 'No token provided'});
    }

    try {
        const user = await authService.verifyToken(token);
        if (user) {
            const userData = await userService.getUserProfile(user.id)
            const streamToken = stream.generateStreamToken(userData.username);
            return res.status(200).json({
                loggedIn: true,
                user,
                streamToken,
                username: userData.username,
                role: userData.role,
                userAvatar: userData.profilePictureUrl,
            });
        } else {
            return res.status(401).json({loggedIn: false, message: 'Invalid token'});
        }
    } catch (error) {
        return res.status(500).json({loggedIn: false, message: 'Failed to authenticate token'});
    }
};

const checkValidationCode = async (req, res) => {
    const {validation_code} = req.body;

    try {
        const userId = await authService.checkValidationCode(validation_code);
        res.status(200).json({userId});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export default {registerAdmin, registerUser, login, logout, checkUser, authCheck, checkValidationCode};
