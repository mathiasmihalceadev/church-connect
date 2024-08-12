import express from 'express';
import postController from '../controllers/postController.js';

const router = express.Router();

router.post('/posts/:userId', postController.createPost);
router.get('/posts/:userId', postController.getAllPosts);
router.get('/post/:id', postController.getPostById);
router.get('/events/:userId', postController.getEvents);
router.delete('/posts/:postId', postController.deletePost);
router.put('/posts/:postId', postController.updatePost);
router.get('/posts/search', postController.searchPostsByName);

export default router;
