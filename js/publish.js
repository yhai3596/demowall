// 检查登录状态
if (!getToken()) {
  window.location.href = 'login.html';
}

// 显示用户信息
const user = getUser();
if (user) {
  document.getElementById('userInfo').textContent = `欢迎, ${user.username}`;
}

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  clearUser();
  window.location.href = 'login.html';
});

// 检查是否为编辑模式
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('id');
let isEditMode = false;

// 如果是编辑模式，加载作品数据
if (editId) {
  isEditMode = true;
  document.querySelector('h1').textContent = '编辑作品';
  document.querySelector('button[type="submit"]').textContent = '更新作品';

  // 加载作品数据
  (async () => {
    try {
      const project = await api.getProject(editId);
      if (project.error) {
        alert('加载作品失败');
        window.location.href = 'admin.html';
        return;
      }

      // 填充表单
      document.getElementById('title').value = project.title || '';
      document.getElementById('description').value = project.description || '';
      document.getElementById('category').value = project.category || '';
      document.getElementById('tools').value = project.tools || '';
      document.getElementById('year').value = project.year || '';
      document.getElementById('status').value = project.status || 'draft';

      // 显示现有图片
      if (project.image) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${project.image}" alt="当前图片">`;
      }
    } catch (error) {
      alert('加载作品失败');
      window.location.href = 'admin.html';
    }
  })();
}

// 图片预览
document.getElementById('image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = `<img src="${e.target.result}" alt="预览">`;
    };
    reader.readAsDataURL(file);
  }
});

// 发布/更新表单处理
document.getElementById('publishForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('tools', document.getElementById('tools').value);
  formData.append('year', document.getElementById('year').value);
  formData.append('status', document.getElementById('status').value);

  const imageFile = document.getElementById('image').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    let result;
    if (isEditMode) {
      result = await api.updateProject(editId, formData);
    } else {
      result = await api.createProject(formData);
    }

    if (result.error) {
      errorMsg.textContent = result.error;
      return;
    }

    alert(isEditMode ? '作品更新成功！' : '作品发布成功！');
    window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
  } catch (error) {
    errorMsg.textContent = isEditMode ? '更新失败，请重试' : '发布失败，请重试';
  }
});
