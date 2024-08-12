import groupService from "../services/groupService.js";

const getAllGroups = async (req, res) => {
    const userId = req.params.userId;

    try {
        const groups = await groupService.getAllGroups(userId);
        if (groups) {
            res.status(201).json({groups});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

const addUserToGroups = async (req, res) => {
    const groupId = req.params.groupId;
    const {userId} = req.body;

    try {
        await groupService.addUserToGroups(userId, groupId);
        res.status(201).json({message: 'User added to groups successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getGroupsByUserId = async (req, res) => {
    const {userId} = req.params;

    try {
        const groups = await groupService.getGroupsByUserId(userId);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const editUserGroups = async (req, res) => {
    const {userId, groupIds} = req.body;

    try {
        await groupService.editUserGroups(userId, groupIds);
        res.status(200).json({message: 'User groups updated successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const removeUserFromGroup = async (req, res) => {
    const {userId, groupId} = req.params;

    try {
        await groupService.removeUserFromGroup(userId, groupId);
        res.status(200).json({message: 'User removed from group successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getUsersByGroupId = async (req, res) => {
    const {groupId} = req.params;
    try {
        const users = await groupService.getUsersByGroupId(groupId);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUsersNotInGroup = async (req, res) => {
    const {groupId} = req.params;

    try {
        const users = await groupService.getUsersNotInGroup(groupId);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export default {
    addUserToGroups,
    getGroupsByUserId,
    editUserGroups,
    removeUserFromGroup,
    getAllGroups,
    getUsersByGroupId,
    getUsersNotInGroup
};