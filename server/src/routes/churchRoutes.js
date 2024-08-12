import express from 'express';
import churchController from '../controllers/churchController.js';

const router = express.Router();

router.post('/register-church', churchController.postChurch);
router.post('/register-church/check-church', churchController.checkChurch);
router.get('/church/:userId', churchController.getChurchByUserId);

export default router;
