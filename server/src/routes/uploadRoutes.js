import express from 'express';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();

router.post('/profile-picture', uploadController.uploadProfilePicture);
router.post('/church-profile-picture', uploadController.uploadChurchProfilePicture);
router.post('/pdf', uploadController.uploadPdf);

export default router;
