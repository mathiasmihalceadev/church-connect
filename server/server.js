import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from "path";
import {fileURLToPath} from 'url';

import churchRoutes from './src/routes/churchRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import groupRoutes from "./src/routes/groupRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import interactionRoutes from "./src/routes/interactionRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";


dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const router = express.Router();

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
app.use('/api', churchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', userRoutes);
app.use('/api', groupRoutes);
app.use('/api', postRoutes);
app.use('/api', interactionRoutes);
app.use('/api', taskRoutes);
app.use('/api', attendanceRoutes);
app.use('/api/comments', commentRoutes);


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
