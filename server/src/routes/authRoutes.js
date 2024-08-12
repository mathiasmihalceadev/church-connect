import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register-admin', authController.registerAdmin);
router.put('/register-user', authController.registerUser);
router.post('/check-validation-code', authController.checkValidationCode);
router.post('/login', authController.login);
router.post('/register/check-user', authController.checkUser);
router.get('/auth-check', authController.authCheck);
router.post('/logout', authController.logout);

export default router;
