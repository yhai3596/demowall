const express = require('express');
const { db } = require('../db');
const { authMiddleware, adminMiddleware } = require('../auth');

const router = express.Router();

// 所有路由需要管理员权限
router.use(authMiddleware, adminMiddleware);

// 获取所有用户
router.get('/users', (req, res) => {
  db.all('SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(users);
  });
});

// 禁用/启用用户
router.put('/users/:id/status', (req, res) => {
  const { status } = req.body; // 'active' | 'banned'

  if (!['active', 'banned'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Update failed' });
    }
    res.json({ message: 'User status updated' });
  });
});

// 获取所有作品（包括草稿）
router.get('/projects', (req, res) => {
  db.all(
    'SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC',
    (err, projects) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(projects);
    }
  );
});

// 数据统计
router.get('/stats', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
    stats.totalUsers = result?.count || 0;

    db.get('SELECT COUNT(*) as count FROM projects', (err, result) => {
      stats.totalProjects = result?.count || 0;

      db.get('SELECT COUNT(*) as count FROM projects WHERE status = "published"', (err, result) => {
        stats.publishedProjects = result?.count || 0;

        res.json(stats);
      });
    });
  });
});

module.exports = router;
