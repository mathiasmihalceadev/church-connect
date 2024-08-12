import attendanceService from '../services/attendanceService.js';

const recordAttendance = async (req, res) => {
    const {postId, userValidationCode} = req.body;

    try {
        await attendanceService.recordAttendance(postId, userValidationCode);
        res.status(201).json({message: 'Attendance recorded successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const recordAttendanceByUserId = async (req, res) => {
    const {postId, userId} = req.body;

    try {
        await attendanceService.recordAttendanceByUserId(postId, userId);
        res.status(201).json({message: 'Attendance recorded successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getUserAttendance = async (req, res) => {
    const {userId} = req.params;

    try {
        const attendanceRecords = await attendanceService.getUserAttendance(userId);
        res.status(200).json({data: attendanceRecords});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export default {
    recordAttendance, getUserAttendance, recordAttendanceByUserId
};