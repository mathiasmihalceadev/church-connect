import express from 'express';
import commentsController from '../controllers/commentController.js';

const router = express.Router();

router.get('/post/:postId', commentsController.getCommentsByPostId);
router.post('/post/:postId', commentsController.postComment);

export default router;
