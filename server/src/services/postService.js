import postDataAccess from '../dataAccess/postDataAccess.js';

const createPost = async (userId, postData) => {
    const {title, text, time_start, time_end, date_start, date_end, post_type_name} = postData;

    // Get church_id from user_id
    const church_id = await postDataAccess.getChurchIdByUserId(userId);

    // Get post_type id from post_type_name
    const post_type = await postDataAccess.getPostTypeIdByName(post_type_name);

    const newPostData = {
        title,
        text,
        time_start,
        time_end,
        date_start,
        date_end,
        post_type,
        church_id,
        user_id: userId
    };

    const postId = await postDataAccess.createPost(newPostData);
    return postId;
};

const getAllPosts = async (userId) => {
    const churchId = await postDataAccess.getChurchIdByUserId(userId)
    return await postDataAccess.getAllPosts(churchId);
};

const getPostById = async (postId) => {
    return await postDataAccess.getPostById(postId);
};

const deletePost = async (postId) => {
    await postDataAccess.deletePost(postId);
};

const updatePost = async (postId, postData) => {
    const {user_id, post_type_name, ...otherData} = postData;

    // Get church_id from user_id
    const church_id = await postDataAccess.getChurchIdByUserId(user_id);

    // Get post_type id from post_type_name
    const post_type = await postDataAccess.getPostTypeIdByName(post_type_name);

    const updatedPostData = {
        ...otherData,
        post_type,
        church_id,
        user_id
    };

    await postDataAccess.updatePost(postId, updatedPostData);
};

const getEvents = async (userId) => {
    const churchId = await postDataAccess.getChurchIdByUserId(userId)
    return await postDataAccess.getEvents(churchId);
};

const searchPostsByName = async (query) => {
    return await postDataAccess.searchPostsByName(query);
};

export default {createPost, getAllPosts, getPostById, deletePost, updatePost, getEvents, searchPostsByName};
