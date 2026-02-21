# Demowall 用户系统使用指南

## 快速开始

### 1. 启动后端服务器

```bash
cd backend
npm install
npm start
```

服务器将运行在 `http://localhost:3000`

### 2. 访问前端

在浏览器打开 `index.html` 或使用本地服务器：

```bash
# 在项目根目录
python -m http.server 8000
```

访问 `http://localhost:8000`

## 默认管理员账号

- **用户名**: `admin`
- **密码**: `admin123`
- **邮箱**: `admin@demowall.com`

⚠️ **生产环境请修改 `backend/.env` 中的密码和 JWT_SECRET**

## 功能说明

### 用户功能

1. **注册/登录**
   - 访问 `login.html` 或 `register.html`
   - 注册需要：用户名、邮箱、密码（至少6位）

2. **发布作品**
   - 登录后点击"发布作品"
   - 填写作品信息并上传图片（最大5MB）
   - 可选择"草稿"或"发布"状态

3. **浏览作品**
   - 首页展示所有已发布作品
   - 支持搜索、分类、工具、年份筛选

### 管理员功能

1. **用户管理**
   - 查看所有用户
   - 禁用/启用用户账号

2. **作品管理**
   - 查看所有作品（包括草稿）
   - 删除任意作品

3. **数据统计**
   - 总用户数
   - 总作品数
   - 已发布作品数

## API 接口

### 用户相关

- `POST /api/user/register` - 注册
- `POST /api/user/login` - 登录
- `GET /api/user/profile` - 获取个人信息（需认证）

### 作品相关

- `GET /api/projects` - 获取作品列表
- `GET /api/projects/:id` - 获取作品详情
- `POST /api/projects` - 发布作品（需认证）
- `PUT /api/projects/:id` - 编辑作品（需认证+权限）
- `DELETE /api/projects/:id` - 删除作品（需认证+权限）

### 管理相关（需管理员权限）

- `GET /api/admin/users` - 用户列表
- `PUT /api/admin/users/:id/status` - 更新用户状态
- `GET /api/admin/projects` - 所有作品
- `GET /api/admin/stats` - 统计数据

## 文件结构

```
demowall/
├── backend/              # 后端
│   ├── server.js         # Express 服务器
│   ├── db.js             # 数据库初始化
│   ├── auth.js           # JWT 认证
│   ├── routes/           # API 路由
│   │   ├── user.js
│   │   ├── project.js
│   │   └── admin.js
│   ├── uploads/          # 上传的图片
│   ├── database.db       # SQLite 数据库
│   └── .env              # 环境变量
├── css/                  # 样式文件
├── js/                   # 前端脚本
│   ├── api.js            # API 调用
│   ├── auth.js           # 认证逻辑
│   ├── app.js            # 主应用
│   ├── publish.js        # 发布页面
│   └── admin.js          # 管理页面
├── login.html            # 登录页面
├── register.html         # 注册页面
├── publish.html          # 发布页面
├── admin.html            # 管理页面
└── index.html            # 首页
```

## 技术栈

- **后端**: Node.js + Express + SQLite + JWT
- **前端**: Vanilla JavaScript + HTML5 + CSS3
- **认证**: JWT Token (7天有效期)
- **图片上传**: Multer (最大5MB)

## 开发说明

### 环境变量 (backend/.env)

```env
PORT=3000
JWT_SECRET=your_secret_key_here
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@demowall.com
ADMIN_PASSWORD=admin123
```

### 数据库表结构

**users 表**
- id, username, email, password, role, status, created_at

**projects 表**
- id, user_id, title, description, category, tools, year, image, status, created_at, updated_at

## 常见问题

### 1. 后端启动失败

检查端口3000是否被占用：
```bash
netstat -ano | findstr :3000
```

### 2. 图片上传失败

确保 `backend/uploads` 目录存在且有写权限

### 3. 登录后无法访问

检查浏览器控制台，确认 token 已保存到 localStorage

### 4. CORS 错误

后端已配置 CORS，如仍有问题，检查 API_BASE 配置（js/api.js）

## 安全建议

1. 修改默认管理员密码
2. 更换 JWT_SECRET 为强密码
3. 生产环境使用 HTTPS
4. 定期备份数据库
5. 限制上传文件类型和大小

## 后续优化

- [ ] 邮箱验证
- [ ] 密码重置功能
- [ ] 作品点赞/收藏
- [ ] 评论系统
- [ ] 图片压缩和CDN
- [ ] 分页加载
- [ ] 搜索优化
