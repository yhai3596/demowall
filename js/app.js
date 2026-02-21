/**
 * DEMOWALL - Main Application
 * Handles data loading, rendering, search, and filtering
 */

(function() {
  'use strict';

  // State
  let allProjects = [];
  let filteredProjects = [];
  let filters = {
    search: '',
    category: '',
    tool: '',
    year: ''
  };

  // DOM Elements
  const elements = {
    grid: document.getElementById('projectsGrid'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    clearFilters: document.getElementById('clearFilters'),
    resultsCount: document.getElementById('resultsCount'),
    emptyState: document.getElementById('emptyState'),
    emptyReset: document.getElementById('emptyReset'),
    categoryValue: document.getElementById('categoryValue'),
    toolValue: document.getElementById('toolValue'),
    yearValue: document.getElementById('yearValue'),
    userNav: document.getElementById('userNav'),
    viewBtns: document.querySelectorAll('.view-btn')
  };

  // Initialize
  async function init() {
    renderUserNav();
    await loadData();
    populateFilters();
    setupEventListeners();
    renderProjects(allProjects);
  }

  // Render user navigation
  function renderUserNav() {
    const user = getUser();
    if (user) {
      elements.userNav.innerHTML = `
        <a href="publish.html" class="nav-link">发布作品</a>
        ${user.role === 'admin' ? '<a href="admin.html" class="nav-link">后台管理</a>' : ''}
        <span class="nav-link">${user.username}</span>
        <button onclick="logout()" class="nav-link" style="background:none;border:none;cursor:pointer;color:inherit;">退出</button>
      `;
    } else {
      elements.userNav.innerHTML = '<a href="login.html" class="nav-link">登录</a>';
    }
  }

  // Logout function
  window.logout = function() {
    clearToken();
    clearUser();
    window.location.reload();
  };

  // Load project data
  async function loadData() {
    try {
      // 优先从API加载
      const projects = await api.getProjects();
      if (projects && Array.isArray(projects) && !projects.error) {
        // API返回的数据需要转换格式
        allProjects = projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          category: p.category || '',
          tools: p.tools ? p.tools.split(',').map(t => t.trim()) : [],
          tags: p.tools ? p.tools.split(',').map(t => t.trim()) : [], // 添加tags字段
          year: p.year || new Date().getFullYear(),
          image: p.image ? `http://localhost:3000${p.image}` : '',
          link: `detail.html?id=${p.id}`
        }));
        filteredProjects = [...allProjects];
        return;
      }
    } catch (error) {
      console.log('API not available, loading from JSON');
    }

    // 降级到本地JSON
    try {
      const response = await fetch('data/projects.json');
      const data = await response.json();
      allProjects = data.projects;
      filteredProjects = [...allProjects];
    } catch (error) {
      console.error('Failed to load projects:', error);
      allProjects = [];
      filteredProjects = [];
    }
  }

  // Populate filter dropdowns dynamically
  function populateFilters() {
    // Get unique categories, tools, and years
    const categories = [...new Set(allProjects.map(p => p.category))].sort();
    const tools = [...new Set(allProjects.flatMap(p => p.tools))].sort();
    const years = [...new Set(allProjects.map(p => p.year))].sort().reverse();

    // Populate category dropdown
    const categoryDropdown = document.getElementById('categoryDropdown');
    categoryDropdown.innerHTML = '<button class="filter-option active" data-value="">全部</button>' +
      categories.map(cat => `<button class="filter-option" data-value="${cat}">${cat}</button>`).join('');

    // Populate tool dropdown
    const toolDropdown = document.getElementById('toolDropdown');
    toolDropdown.innerHTML = '<button class="filter-option active" data-value="">全部</button>' +
      tools.map(tool => `<button class="filter-option" data-value="${tool}">${tool}</button>`).join('');

    // Populate year dropdown
    const yearDropdown = document.getElementById('yearDropdown');
    yearDropdown.innerHTML = '<button class="filter-option active" data-value="">全部</button>' +
      years.map(year => `<button class="filter-option" data-value="${year}">${year}</button>`).join('');

    // Re-bind filter option events after populating
    bindFilterOptions();
  }

  // Bind filter option click events
  function bindFilterOptions() {
    document.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.dataset.value;
        const filterType = option.closest('.filter-dropdown').id.replace('Dropdown', '');

        // Update filter
        filters[filterType] = value;

        // Update UI
        option.parentElement.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');

        // Update toggle text
        const valueEl = document.getElementById(filterType + 'Value');
        if (valueEl) {
          valueEl.textContent = value || '全部';
        }

        // Close dropdown
        option.closest('.filter-dropdown').classList.remove('show');
        const toggle = option.closest('.filter-group').querySelector('.filter-toggle');
        if (toggle) toggle.classList.remove('active');

        applyFilters();
      });
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Search
    let searchTimeout;
    elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const value = e.target.value.trim();

      // Show/hide clear button
      elements.searchClear.classList.toggle('visible', value.length > 0);

      // Debounce search
      searchTimeout = setTimeout(() => {
        filters.search = value.toLowerCase();
        applyFilters();
      }, 200);
    });

    // Search clear
    elements.searchClear.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.searchClear.classList.remove('visible');
      filters.search = '';
      applyFilters();
    });

    // Filter toggles (click on filter button to show dropdown)
    document.querySelectorAll('.filter-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = toggle.classList.contains('active');

        // Close all dropdowns
        document.querySelectorAll('.filter-toggle').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('show'));

        // Toggle this one
        if (!isActive) {
          toggle.classList.add('active');
          const dropdown = toggle.nextElementSibling;
          if (dropdown) dropdown.classList.add('show');
        }
      });
    });

    // Filter options (initial binding, will be re-bound after populate)
    bindFilterOptions();

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.filter-toggle').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('show'));
    });

    // Clear filters
    elements.clearFilters.addEventListener('click', resetFilters);
    elements.emptyReset.addEventListener('click', resetFilters);

    // View toggle
    elements.viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        // Update active state
        elements.viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle grid class
        if (view === 'list') {
          elements.grid.classList.add('list-view');
        } else {
          elements.grid.classList.remove('list-view');
        }
      });
    });
  }

  // Apply all filters
  function applyFilters() {
    filteredProjects = allProjects.filter(project => {
      // Search filter
      if (filters.search) {
        const searchText = [
          project.title,
          project.description,
          ...project.tags,
          project.category
        ].join(' ').toLowerCase();

        if (!searchText.includes(filters.search)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && project.category !== filters.category) {
        return false;
      }

      // Tool filter
      if (filters.tool && !project.tools.includes(filters.tool)) {
        return false;
      }

      // Year filter
      if (filters.year && String(project.year) !== String(filters.year)) {
        return false;
      }

      return true;
    });

    renderProjects(filteredProjects);
  }

  // Reset all filters
  function resetFilters() {
    filters = {
      search: '',
      category: '',
      tool: '',
      year: ''
    };

    // Reset search input
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');

    // Reset filter values display
    elements.categoryValue.textContent = '全部';
    elements.toolValue.textContent = '全部';
    elements.yearValue.textContent = '全部';

    // Reset filter options
    document.querySelectorAll('.filter-option').forEach(option => {
      option.classList.toggle('active', option.dataset.value === '');
    });

    applyFilters();
  }

  // Render projects
  function renderProjects(projects) {
    // Update count
    elements.resultsCount.textContent = projects.length;

    // Show/hide empty state
    if (projects.length === 0) {
      elements.grid.style.display = 'none';
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.grid.style.display = 'grid';
    elements.emptyState.style.display = 'none';

    // Render cards
    elements.grid.innerHTML = projects.map((project, index) => `
      <article class="project-card" data-id="${project.id}" style="animation-delay: ${index * 0.05}s">
        <a href="detail.html?id=${project.id}" class="project-card-link">
          <div class="project-card-image">
            ${project.image ? `<img src="${project.image}" alt="${project.title}">` : `<div class="placeholder">${project.title.charAt(0)}</div>`}
            <div class="project-card-overlay"></div>
            <div class="project-card-cta">
              <span class="view-label">查看详情</span>
              <span class="view-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
          <div class="project-card-content">
            <p class="project-card-category">${project.category}</p>
            <h3 class="project-card-title">${project.title}</h3>
            <div class="project-card-tags">
              ${project.tags.slice(0, 3).map(tag => `
                <span class="project-card-tag">${tag}</span>
              `).join('')}
            </div>
          </div>
        </a>
      </article>
    `).join('');

    // Add stagger animation
    requestAnimationFrame(() => {
      document.querySelectorAll('.project-card').forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 50);
      });
    });
  }

  // Start the app
  init();
})();
