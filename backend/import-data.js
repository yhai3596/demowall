const fs = require('fs');
const path = require('path');
const { db } = require('./db');

// 读取示例数据
const projectsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/projects.json'), 'utf8')
);

// 导入数据
const importProjects = () => {
  console.log('开始导入示例数据...');

  let count = 0;
  let errors = 0;

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO projects (user_id, title, description, category, tools, year, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    projectsData.projects.forEach(project => {
      const tools = Array.isArray(project.tools) ? project.tools.join(', ') : project.tools;
      const year = parseInt(project.year) || new Date().getFullYear();

      stmt.run(
        1, // user_id: admin
        project.title,
        project.description,
        project.category,
        tools,
        year,
        project.thumbnail || '',
        'published',
        (err) => {
          if (err) {
            console.error(`导入失败: ${project.title}`, err.message);
            errors++;
          } else {
            count++;
          }
        }
      );
    });

    stmt.finalize(() => {
      console.log(`✓ 成功导入 ${count} 个作品`);
      if (errors > 0) console.log(`✗ 失败 ${errors} 个`);

      // 显示统计
      db.get('SELECT COUNT(*) as total FROM projects', (err, row) => {
        console.log(`数据库中共有 ${row.total} 个作品`);
        process.exit(0);
      });
    });
  });
};

// 执行导入
importProjects();
