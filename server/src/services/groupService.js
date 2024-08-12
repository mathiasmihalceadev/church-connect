import groupDataAccess from "../dataAccess/groupDataAccess.js";

const getAllGroups = async (userId) => {
    const churchId = await groupDataAccess.getChurchId(userId);
    return await groupDataAccess.getAllGroups(churchId);
}

const getUsersNotInGroup = async (groupId) => {
    return await groupDataAccess.getUsersNotInGroup(groupId);
};

const addUserToGroups = async (userId, groupId) => {
    await groupDataAccess.addUserToGroups(userId, groupId);
};

const getGroupsByUserId = async (userId) => {
    return await groupDataAccess.getGroupsByUserId(userId);
};

const editUserGroups = async (userId, groupIds) => {
    await groupDataAccess.editUserGroups(userId, groupIds);
};

const removeUserFromGroup = async (userId, groupId) => {
    await groupDataAccess.removeUserFromGroup(userId, groupId);
};

const getUsersByGroupId = async (groupId) => {
    return await groupDataAccess.getUsersByGroupId(groupId);
};

export default {
    getAllGroups,
    addUserToGroups,
    getGroupsByUserId,
    editUserGroups,
    removeUserFromGroup,
    getUsersByGroupId,
    getUsersNotInGroup
}