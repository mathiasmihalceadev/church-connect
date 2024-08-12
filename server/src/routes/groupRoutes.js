import express from 'express';
import groupController from '../controllers/groupController.js';

const router = express.Router();

router.get('/groups/:userId', groupController.getAllGroups);

router.post('/group/:groupId/user', groupController.addUserToGroups);
router.get('/groups/user/:userId', groupController.getGroupsByUserId);
router.put('/groups/edit-user', groupController.editUserGroups);
router.delete('/group/:groupId/user/:userId', groupController.removeUserFromGroup);
router.get('/group/:groupId/users', groupController.getUsersByGroupId);
router.get('/group/:groupId/not-in-group', groupController.getUsersNotInGroup);

export default router;
