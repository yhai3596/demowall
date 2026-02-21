const express = require('express');
const multer = require('multer');
const path = require('path');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();

// 图片上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// 获取作品列表（公开）
router.get('/', (req, res) => {
  const { category, tool, year, status = 'published' } = req.query;
  let query = 'SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id WHERE p.status = ?';
  const params = [status];

  if (category) {
    query += ' AND p.category = ?';
    params.push(category);
  }
  if (tool) {
    query += ' AND p.tools LIKE ?';
    params.push(`%${tool}%`);
  }
  if (year) {
    query += ' AND p.year = ?';
    params.push(year);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, projects) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(projects);
  });
});

// 获取作品详情
router.get('/:id', (req, res) => {
  db.get(
    'SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
    [req.params.id],
    (err, project) => {
      if (err || !project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    }
  );
});

// 发布作品
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  const { title, description, category, tools, year, status = 'draft' } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  db.run(
    'INSERT INTO projects (user_id, title, description, category, tools, year, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, title, description, category, tools, year, image, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create project' });
      }
      res.json({ message: 'Project created', projectId: this.lastID });
    }
  );
});

// 编辑作品
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
  const { title, description, category, tools, year, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, project) => {
    if (err || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const updates = [];
    const params = [];

    if (title) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (category) { updates.push('category = ?'); params.push(category); }
    if (tools) { updates.push('tools = ?'); params.push(tools); }
    if (year) { updates.push('year = ?'); params.push(year); }
    if (image) { updates.push('image = ?'); params.push(image); }
    if (status) { updates.push('status = ?'); params.push(status); }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.run(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
      params,
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Update failed' });
        }
        res.json({ message: 'Project updated' });
      }
    );
  });
});

// 删除作品
router.delete('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, project) => {
    if (err || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    db.run('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Delete failed' });
      }
      res.json({ message: 'Project deleted' });
    });
  });
});

module.exports = router;
