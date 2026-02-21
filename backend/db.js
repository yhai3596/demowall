const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// 设置UTF-8编码
db.run("PRAGMA encoding = 'UTF-8'");

// 初始化数据库
const initDB = () => {
  db.serialize(() => {
    // 用户表
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 作品表
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        tools TEXT,
        year INTEGER,
        image TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 创建默认管理员
    const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.run(
      `INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_EMAIL || 'admin@demowall.com', adminPassword, 'admin'],
      (err) => {
        if (err) console.error('Admin creation error:', err);
        else console.log('✓ Admin user initialized');
      }
    );
  });
};

module.exports = { db, initDB };
