import express from 'express';
import interactionController from '../controllers/interactionController.js';

const router = express.Router();

router.post('/interactions', interactionController.createInteraction);
router.delete('/interactions', interactionController.deleteInteraction);
router.get('/interactions/:userId/:postId', interactionController.getUserInteraction);
router.get('/interactions-users/:postId', interactionController.getUsersWhoInteractedWithPost);

export default router;
