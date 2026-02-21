require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 初始化数据库
initDB();

// 路由
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Demowall API is running' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 Demowall Backend Server`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`👤 Admin: ${process.env.ADMIN_USERNAME} / ${process.env.ADMIN_PASSWORD}\n`);
});
