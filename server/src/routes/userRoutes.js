import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/user/:id', userController.getUserProfile);
router.put('/user/:id', userController.updateUser);
router.post('/user', userController.createUser);
router.get('/users/pending/:adminId', userController.getPendingUsers);
router.get('/user/validation-code/:code', userController.getUserIdByValidationCode);
router.delete('/user/:userId', userController.deleteUser);
router.get('/users/:userId', userController.getAllUsersByChurchId);
router.get('/users/group/:groupId', userController.getUsersByGroupId);
router.get('/users/paginated/:userId', userController.getUsersPaginated);


export default router;
