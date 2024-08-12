import taskDataAccess from '../dataAccess/taskDataAccess.js';
import userDataAccess from "../dataAccess/userDataAccess.js";

export const getTasksByPostIdAndGroupId = async (postId, groupId) => {
    return await taskDataAccess.getTasksByPostIdAndGroupId(postId, groupId);
};

const createTaskWithUsernames = async (postId, taskName, usernames, groupId, userId) => {
    // Fetch user IDs based on usernames
    const userIds = await userDataAccess.getUserIdsByUsernames(usernames);

    // Create the task
    const taskId = await taskDataAccess.createTask(postId, taskName, groupId, userId);

    // Assign users to the task
    for (const userId of userIds) {
        await taskDataAccess.assignUserToTask(taskId, userId);
    }
};

const getUsersByTaskId = async (taskId) => {
    return await taskDataAccess.getUsersByTaskId(taskId);
};

const deleteTaskById = async (taskId) => {
    await taskDataAccess.deleteUsersByTaskId(taskId);
    await taskDataAccess.deleteTaskById(taskId);
};

const unassignUserFromTask = async (taskId, userId) => {
    await taskDataAccess.unassignUserFromTask(taskId, userId);
};

const setUserHasSeen = async (taskId, userId) => {
    await taskDataAccess.setUserHasSeen(taskId, userId);
};

const setUserHasUnseen = async (taskId, userId) => {
    await taskDataAccess.setUserHasUnseen(taskId, userId);
};

const checkUserAssignmentSeen = async (taskId, userId) => {
    return await taskDataAccess.checkUserAssignmentSeen(taskId, userId);
};

const getUnassignedUsers = async (groupId, taskId) => {
    return await taskDataAccess.getUnassignedUsers(groupId, taskId);
};

const addUsersToTaskByUsername = async (taskId, usernames) => {
    return await taskDataAccess.addUsersToTaskByUsername(taskId, usernames);
};

export default {
    getTasksByPostIdAndGroupId,
    createTaskWithUsernames,
    getUsersByTaskId,
    deleteTaskById,
    unassignUserFromTask,
    setUserHasSeen,
    setUserHasUnseen,
    checkUserAssignmentSeen,
    getUnassignedUsers,
    addUsersToTaskByUsername
};

