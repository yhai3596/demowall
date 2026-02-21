// API 配置
const API_BASE = 'http://localhost:3000/api';

// 获取 token
const getToken = () => localStorage.getItem('token');

// 设置 token
const setToken = (token) => localStorage.setItem('token', token);

// 清除 token
const clearToken = () => localStorage.removeItem('token');

// 获取用户信息
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// 设置用户信息
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// 清除用户信息
const clearUser = () => localStorage.removeItem('user');

// API 请求封装
const api = {
  // 用户注册
  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return res.json();
  },

  // 用户登录
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  // 获取个人信息
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // 获取作品列表
  getProjects: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/projects?${params}`);
    return res.json();
  },

  // 获取作品详情
  getProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return res.json();
  },

  // 发布作品
  createProject: async (formData) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    return res.json();
  },

  // 编辑作品
  updateProject: async (id, formData) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    });
    return res.json();
  },

  // 删除作品
  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // 管理员：获取所有用户
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // 管理员：更新用户状态
  updateUserStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // 管理员：获取所有作品
  getAllProjects: async () => {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  // 管理员：获取统计数据
  getStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};
