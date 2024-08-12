import commentsDataAccess from '../dataAccess/commentDataAccess.js';

const getCommentsByPostId = async (postId) => {
    return await commentsDataAccess.getCommentsByPostId(postId);
};

const postComment = async (postId, userId, comment_text) => {
    return await commentsDataAccess.postComment(postId, userId, comment_text);
};

export default {getCommentsByPostId, postComment};
