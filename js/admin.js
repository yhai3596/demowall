// 检查管理员权限
const user = getUser();
if (!user || user.role !== 'admin') {
  alert('需要管理员权限');
  window.location.href = 'index.html';
}

// 显示用户信息
document.getElementById('userInfo').textContent = `管理员: ${user.username}`;

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  clearUser();
  window.location.href = 'login.html';
});

// 标签页切换
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`${tab}Tab`).classList.add('active');
  });
});

// 加载统计数据
const loadStats = async () => {
  const stats = await api.getStats();
  document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
  document.getElementById('totalProjects').textContent = stats.totalProjects || 0;
  document.getElementById('publishedProjects').textContent = stats.publishedProjects || 0;
};

// 加载用户列表
const loadUsers = async () => {
  const users = await api.getUsers();
  const tbody = document.getElementById('usersTable');

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td><span class="status-badge status-${u.status}">${u.status === 'active' ? '正常' : '已禁用'}</span></td>
      <td>${new Date(u.created_at).toLocaleDateString()}</td>
      <td>
        ${u.role !== 'admin' ? `
          <button class="btn-action ${u.status === 'active' ? 'btn-ban' : 'btn-activate'}"
                  onclick="toggleUserStatus(${u.id}, '${u.status}')">
            ${u.status === 'active' ? '禁用' : '启用'}
          </button>
        ` : '-'}
      </td>
    </tr>
  `).join('');
};

// 切换用户状态
window.toggleUserStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'banned' : 'active';
  if (!confirm(`确定要${newStatus === 'banned' ? '禁用' : '启用'}该用户吗？`)) return;

  await api.updateUserStatus(id, newStatus);
  loadUsers();
};

// 加载作品列表
const loadProjects = async () => {
  const projects = await api.getAllProjects();
  const tbody = document.getElementById('projectsTable');

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.username}</td>
      <td>${p.category || '-'}</td>
      <td><span class="status-badge status-${p.status}">${p.status === 'published' ? '已发布' : '草稿'}</span></td>
      <td>${new Date(p.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn-action btn-edit" onclick="editProject(${p.id})">编辑</button>
        <button class="btn-action btn-delete" onclick="deleteProject(${p.id})">删除</button>
      </td>
    </tr>
  `).join('');
};

// 编辑作品
window.editProject = (id) => {
  window.location.href = `publish.html?id=${id}`;
};

// 删除作品
window.deleteProject = async (id) => {
  if (!confirm('确定要删除该作品吗？')) return;

  await api.deleteProject(id);
  loadProjects();
  loadStats();
};

// 初始化
loadStats();
loadUsers();
loadProjects();
