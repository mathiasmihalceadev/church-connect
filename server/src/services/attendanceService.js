// services/attendanceService.js
import attendanceDataAccess from '../dataAccess/attendanceDataAccess.js';
import userDataAccess from '../dataAccess/userDataAccess.js';

const recordAttendance = async (postId, userValidationCode) => {
    // Get user id from validation code
    const user = await userDataAccess.getUserByValidationCode(userValidationCode);
    if (!user) {
        throw new Error('User not found');
    }

    await attendanceDataAccess.recordAttendance(postId, user.id);
};

const recordAttendanceByUserId = async (postId, userId) => {
    await attendanceDataAccess.recordAttendance(postId, userId);
};

const getUserAttendance = async (userId) => {
    return await attendanceDataAccess.getUserAttendance(userId);
};

export default {
    recordAttendance, getUserAttendance, recordAttendanceByUserId
};
