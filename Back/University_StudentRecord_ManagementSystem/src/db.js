import pkg from "mssql"; // 导入默认导出
const { ConnectionPool } = pkg; // 解构所需对象
const sql = pkg; // 保留完整对象
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mockPool from './mockDb.js';

// 设置 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Environment variables:', {
  DB_SERVER: process.env.DB_SERVER,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '.\SQLEXPRESS',
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectTimeout: 30000, // 增加连接超时
    requestTimeout: 30000  // 增加请求超时
  },
};

console.log("Database Config:", {
  ...config,
  password: '******'
});

// 导出 poolPromise，并处理连接失败情况
export const poolPromise = new ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
    console.error("Stack:", err.stack);
    console.warn("Using mock database for development!");
    // 返回模拟池而不是抛出错误，这样应用可以继续运行
    return mockPool;
  });

export { sql };
