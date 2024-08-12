import commentsService from '../services/commentService.js';

const getCommentsByPostId = async (req, res) => {
    const {postId} = req.params;

    try {
        const comments = await commentsService.getCommentsByPostId(postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const postComment = async (req, res) => {
    const {postId} = req.params;
    const {userId, comment_text} = req.body;

    try {
        const comment = await commentsService.postComment(postId, userId, comment_text);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export default {getCommentsByPostId, postComment};
