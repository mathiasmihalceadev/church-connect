import postService from '../services/postService.js';
import * as events from "node:events";

const createPost = async (req, res) => {
    const {userId} = req.params;
    const postData = req.body;

    try {
        const postId = await postService.createPost(userId, postData);
        res.status(201).json({postId});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getAllPosts = async (req, res) => {
    const {userId} = req.params;

    try {
        const posts = await postService.getAllPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPostById = async (req, res) => {
    const {id} = req.params;

    try {
        const post = await postService.getPostById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deletePost = async (req, res) => {
    const {postId} = req.params;

    try {
        await postService.deletePost(postId);
        res.status(200).json({message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const updatePost = async (req, res) => {
    const {postId} = req.params;
    const postData = req.body;

    try {
        await postService.updatePost(postId, postData);
        res.status(200).json({message: 'Post updated successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getEvents = async (req, res) => {
    const {userId} = req.params;

    try {
        const events = await postService.getEvents(userId);
        res.status(200).json({events: events});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

const searchPostsByName = async (req, res) => {
    const {query} = req.query;

    try {
        const posts = await postService.searchPostsByName(query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export default {createPost, getAllPosts, getPostById, deletePost, updatePost, getEvents, searchPostsByName};
