import express from 'express';
import taskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks/post/:postId/group/:groupId', taskController.getTasksByPostIdAndGroupId);
router.post('/tasks/:postId/:groupId/:userId', taskController.createTaskWithUsernames);
router.get('/tasks/:taskId/users', taskController.getUsersByTaskId);
router.delete('/task/:taskId', taskController.deleteTaskById);
router.delete('/task/:taskId/user/:userId', taskController.unassignUserFromTask);
router.post('/task/:taskId/user/:userId/seen', taskController.setUserHasSeen);
router.post('/task/:taskId/user/:userId/unseen', taskController.setUserHasUnseen);
router.get('/task/:taskId/user/:userId/seen', taskController.checkUserAssignmentSeen);
router.get('/group/:groupId/task/:taskId/unassigned-users', taskController.getUnassignedUsers);
router.post('/task/:taskId/users-by-username', taskController.addUsersToTaskByUsername);


export default router;
