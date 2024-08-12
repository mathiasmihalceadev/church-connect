import userService from '../services/userService.js';

const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const userProfile = await userService.getUserProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    try {
        const updatedUser = await userService.updateUser(userId, userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createUser = async (req, res) => {
    const {validation_code, first_name, last_name, groups, user_role, admin_id} = req.body;

    try {
        const newUser = await userService.createUser({
            validation_code,
            first_name,
            last_name,
            groups,
            user_role,
            admin_id
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPendingUsers = async (req, res) => {
    const {adminId} = req.params;
    try {
        const pendingUsers = await userService.getPendingUsers(adminId);
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserIdByValidationCode = async (req, res) => {
    const {code} = req.params;
    try {
        const userId = await userService.getUserIdByValidationCode(code);
        res.status(200).json({userId});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteUser = async (req, res) => {
    const {userId} = req.params;

    try {
        await userService.deleteUser(userId);
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getAllUsersByChurchId = async (req, res) => {
    const {userId} = req.params;

    try {
        const users = await userService.getAllUsersByChurchId(userId);
        res.status(200).json({data: users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUsersByGroupId = async (req, res) => {
    const {groupId} = req.params;
    try {
        const users = await userService.getUsersByGroupId(groupId);
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUsersPaginated = async (req, res) => {
    const {userId} = req.params;
    const {page, limit} = req.query;

    try {
        const {rows, total} = await userService.getUsersByChurchIdPaginated(userId, parseInt(page), parseInt(limit));
        res.status(200).json({data: rows, total});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export default {
    getUserProfile,
    updateUser,
    createUser,
    getPendingUsers,
    getUserIdByValidationCode,
    deleteUser,
    getAllUsersByChurchId,
    getUsersPaginated,
    getUsersByGroupId
};


