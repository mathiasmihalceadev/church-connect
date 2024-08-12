// routes/attendanceRoutes.js
import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/attendance', attendanceController.recordAttendance);
router.post('/attendance/by-user-id', attendanceController.recordAttendanceByUserId);
router.get('/user/:userId/attendance', attendanceController.getUserAttendance);


export default router;
