// 登录表单处理
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const result = await api.login(username, password);

      if (result.error) {
        errorMsg.textContent = result.error;
        return;
      }

      setToken(result.token);
      setUser(result.user);

      // 跳转到首页
      window.location.href = 'index.html';
    } catch (error) {
      errorMsg.textContent = '登录失败，请重试';
    }
  });
}

// 注册表单处理
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) {
      errorMsg.textContent = '密码至少6位';
      return;
    }

    try {
      const result = await api.register(username, email, password);

      if (result.error) {
        errorMsg.textContent = result.error;
        return;
      }

      alert('注册成功！请登录');
      window.location.href = 'login.html';
    } catch (error) {
      errorMsg.textContent = '注册失败，请重试';
    }
  });
}

// 检查登录状态
const checkAuth = () => {
  const token = getToken();
  const user = getUser();
  return token && user;
};

// 退出登录
const logout = () => {
  clearToken();
  clearUser();
  window.location.href = 'login.html';
};
