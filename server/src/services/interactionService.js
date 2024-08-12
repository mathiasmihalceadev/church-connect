import interactionDataAccess from '../dataAccess/interactionDataAccess.js';

const createInteraction = async (userId, postId, interactionType) => {
    return await interactionDataAccess.createInteraction(userId, postId, interactionType);
};

const deleteInteraction = async (userId, postId, interactionType) => {
    return await interactionDataAccess.deleteInteraction(userId, postId, interactionType);
};

const getUserInteraction = async (userId, postId) => {
    return await interactionDataAccess.getUserInteraction(userId, postId);
};

const getUsersWhoInteractedWithPost = async (postId) => {
    return await interactionDataAccess.getUsersWhoInteractedWithPost(postId);
};

export default {getUsersWhoInteractedWithPost, getUserInteraction, createInteraction, deleteInteraction};
