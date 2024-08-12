import taskService from '../services/taskService.js';

export const getTasksByPostIdAndGroupId = async (req, res) => {
    const {postId, groupId} = req.params;
    try {
        const tasks = await taskService.getTasksByPostIdAndGroupId(postId, groupId);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createTaskWithUsernames = async (req, res) => {
    const {postId, groupId, userId} = req.params;
    const {taskName, usernames} = req.body;

    try {
        await taskService.createTaskWithUsernames(postId, taskName, usernames, groupId, userId);
        res.status(201).json({message: 'Task created successfully with assigned users'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUsersByTaskId = async (req, res) => {
    const {taskId} = req.params;

    try {
        const users = await taskService.getUsersByTaskId(taskId);
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteTaskById = async (req, res) => {
    const {taskId} = req.params;

    try {
        await taskService.deleteTaskById(taskId);
        res.status(200).json({message: 'Task deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const unassignUserFromTask = async (req, res) => {
    const {taskId, userId} = req.params;

    try {
        await taskService.unassignUserFromTask(taskId, userId);
        res.status(200).json({message: 'User unassigned from task successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const setUserHasSeen = async (req, res) => {
    const {taskId, userId} = req.params;

    try {
        await taskService.setUserHasSeen(taskId, userId);
        res.status(200).json({message: 'User has seen the task'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const setUserHasUnseen = async (req, res) => {
    const {taskId, userId} = req.params;

    try {
        await taskService.setUserHasUnseen(taskId, userId);
        res.status(200).json({message: 'User has not seen the task'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const checkUserAssignmentSeen = async (req, res) => {
    const {taskId, userId} = req.params;

    try {
        const isAssigned = await taskService.checkUserAssignmentSeen(taskId, userId);
        res.status(200).json({isAssigned});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUnassignedUsers = async (req, res) => {
    const {groupId, taskId} = req.params;

    try {
        const users = await taskService.getUnassignedUsers(groupId, taskId);
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const addUsersToTaskByUsername = async (req, res) => {
    const {taskId} = req.params;
    const {usernames} = req.body;

    try {
        await taskService.addUsersToTaskByUsername(taskId, usernames);
        res.status(200).json({message: "Users added to task successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
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
