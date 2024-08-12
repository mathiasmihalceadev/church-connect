import interactionService from '../services/interactionService.js';

const createInteraction = async (req, res) => {
    const {userId, postId, interactionType} = req.body;

    try {
        const interactionId = await interactionService.createInteraction(userId, postId, interactionType);
        res.status(201).json({interactionId});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteInteraction = async (req, res) => {
    const {userId, postId, interactionType} = req.body;

    try {
        const affectedRows = await interactionService.deleteInteraction(userId, postId, interactionType);
        if (affectedRows > 0) {
            res.status(200).json({message: 'Interaction removed successfully'});
        } else {
            res.status(404).json({message: 'Interaction not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserInteraction = async (req, res) => {
    const {userId, postId} = req.params;

    try {
        const interaction = await interactionService.getUserInteraction(userId, postId);
        if (interaction) {
            res.status(200).json(interaction);
        } else {
            res.status(404).json({message: 'Interaction not found'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUsersWhoInteractedWithPost = async (req, res) => {
    const {postId} = req.params;

    try {
        const users = await interactionService.getUsersWhoInteractedWithPost(postId);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export default {getUsersWhoInteractedWithPost, getUserInteraction, createInteraction, deleteInteraction};
