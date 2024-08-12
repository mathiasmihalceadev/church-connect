import uploadDataAccess from '../dataAccess/uploadDataAccess.js';
import fs from 'fs';
import path from 'path';

const handleProfilePictureUpload = async (req) => {
    if (!req.file) {
        throw new Error('No file uploaded.');
    }

    const userId = req.body.userId;
    const churchId = await uploadDataAccess.getChurchIdForUser(userId);

    const timestamp = Date.now();
    const originalName = req.file.originalname.split('.').slice(0, -1).join('.'); // Remove extension from original name
    const extension = req.file.originalname.split('.').pop(); // Get file extension
    const newFileName = `${userId}_${churchId}_${timestamp}_${originalName}.${extension}`;
    const newFilePath = path.join('src/uploads', newFileName);

    // Rename the file to the new filename
    fs.renameSync(req.file.path, newFilePath);

    const url = `/uploads/${newFileName}`;

    const resourceId = await uploadDataAccess.saveFileData({
        userId,
        churchId,
        url,
        type: 'photo'
    });

    await uploadDataAccess.updateUserProfilePicture(userId, resourceId);

    return {file: newFileName, userId, churchId, url};
};

const handleChurchProfileUpload = async (req) => {
    if (!req.file) {
        throw new Error('No file uploaded.');
    }

    const userId = req.body.userId;
    const churchId = await uploadDataAccess.getChurchIdForUser(userId);

    const timestamp = Date.now();
    const originalName = req.file.originalname.split('.').slice(0, -1).join('.'); // Remove extension from original name
    const extension = req.file.originalname.split('.').pop(); // Get file extension
    const newFileName = `${userId}_${churchId}_${timestamp}_${originalName}.${extension}`;
    const newFilePath = path.join('src/uploads', newFileName);

    // Rename the file to the new filename
    fs.renameSync(req.file.path, newFilePath);

    const url = `/uploads/${newFileName}`;

    const resourceId = await uploadDataAccess.saveFileData({
        userId,
        churchId,
        url,
        type: 'photo'
    });

    await uploadDataAccess.updateChurchProfilePicture(churchId, resourceId);

    return {file: newFileName, userId, churchId, url};
};

const handlePdfUpload = async (file, postId, groupId) => {
    if (!file) {
        throw new Error('No file uploaded.');
    }

    const timestamp = Date.now();
    const originalName = file.originalname.split('.').slice(0, -1).join('.'); // Remove extension from original name
    const extension = file.originalname.split('.').pop(); // Get file extension
    const newFileName = `${timestamp}_${originalName}.${extension}`;
    const newFilePath = path.join('src/uploads', newFileName);

    // Rename the file to the new filename
    fs.renameSync(file.path, newFilePath);

    const url = `/uploads/${newFileName}`;

    const resourceId = await uploadDataAccess.saveFileData({
        url,
        type: 'pdf'
    });

    await uploadDataAccess.addPostResource(postId, resourceId, groupId);

    return {file: newFileName, url};
};

export default {
    handleProfilePictureUpload,
    handleChurchProfileUpload,
    handlePdfUpload
};
