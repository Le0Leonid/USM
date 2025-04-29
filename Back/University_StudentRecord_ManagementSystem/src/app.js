// 入口
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 .env 文件正确加载
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import gradeRoutes from "./routes/grades.js";
import awardRoutes from "./routes/award.js";
import statsRoutes from "./routes/stats.js";
import { errorHandler } from './utils/helpers.js';
import { poolPromise } from './db.js';

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 简单的健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API版本前缀
const apiPrefix = '/api/v1';

// 路由配置
app.use(`${apiPrefix}/students`, studentRoutes);
app.use(`${apiPrefix}/courses`, courseRoutes);
app.use(`${apiPrefix}/grades`, gradeRoutes);
app.use(`${apiPrefix}/awards`, awardRoutes);
app.use(`${apiPrefix}/stats`, statsRoutes);

// 首页路由
app.get('/', (req, res) => {
  res.json({
    message: '学籍管理系统API',
    version: '1.0.0',
    endpoints: [
      `${apiPrefix}/students`,
      `${apiPrefix}/courses`,
      `${apiPrefix}/grades`,
      `${apiPrefix}/awards`,
      `${apiPrefix}/stats`
    ]
  });
});

// 错误处理中间件
app.use(errorHandler);

// 处理 404 错误
app.use((req, res) => {
  res.status(404).json({ message: '请求的资源不存在' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
});

// npm run dev
// npm run start / npm start
// npm run db:init