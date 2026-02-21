/**
 * DEMOWALL - Detail Page
 * Handles loading and displaying individual project details
 */

(function() {
  'use strict';

  // State
  let allProjects = [];
  let currentProject = null;
  let currentIndex = 0;

  // DOM Elements
  const elements = {
    content: document.getElementById('detailContent'),
    prevProject: document.getElementById('prevProject'),
    nextProject: document.getElementById('nextProject'),
    prevTitle: document.getElementById('prevTitle'),
    nextTitle: document.getElementById('nextTitle')
  };

  // Initialize
  async function init() {
    await loadData();
    loadProject();
    updateNavigation();
  }

  // Load project data
  async function loadData() {
    try {
      // 优先从API加载
      const projects = await api.getProjects();
      if (projects && Array.isArray(projects) && !projects.error) {
        allProjects = projects.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          category: p.category || '',
          tools: p.tools ? p.tools.split(',').map(t => t.trim()) : [],
          tags: p.tools ? p.tools.split(',').map(t => t.trim()) : [],
          year: p.year || new Date().getFullYear(),
          image: p.image ? `http://localhost:3000${p.image}` : '',
          link: `detail.html?id=${p.id}`
        }));
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
    } catch (error) {
      console.error('Failed to load projects:', error);
      allProjects = [];
    }
  }

  // Get project ID from URL
  function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  // Load current project
  function loadProject() {
    const projectId = getProjectId();

    if (!projectId) {
      showNotFound();
      return;
    }

    currentIndex = allProjects.findIndex(p => p.id == projectId); // 使用 == 而不是 ===
    currentProject = allProjects[currentIndex];

    if (!currentProject) {
      showNotFound();
      return;
    }

    renderProject();
    updatePageTitle();
  }

  // Update page title
  function updatePageTitle() {
    if (currentProject) {
      document.title = `${currentProject.title} · DEMOWALL`;
    }
  }

  // Render project details
  function renderProject() {
    const project = currentProject;

    elements.content.innerHTML = `
      <header class="detail-header">
        <span class="detail-category">${project.category}</span>
        <h1 class="detail-title">${project.title}</h1>
        <p class="detail-description">${project.description}</p>
      </header>

      <div class="detail-meta">
        <div class="meta-item">
          <p class="meta-label">工具</p>
          <div class="meta-tags">
            ${project.tools.map(tool => `<span class="meta-tag">${tool}</span>`).join('')}
          </div>
        </div>
        <div class="meta-item">
          <p class="meta-label">年份</p>
          <p class="meta-value">${project.year}</p>
        </div>
        <div class="meta-item">
          <p class="meta-label">标签</p>
          <div class="meta-tags">
            ${project.tags.map(tag => `<span class="meta-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="detail-gallery">
        <div class="gallery-main">
          <div class="placeholder">${project.title.charAt(0)}</div>
        </div>
        ${project.images && project.images.length > 1 ? `
          <div class="gallery-thumbs">
            ${project.images.map((img, i) => `
              <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                <div class="placeholder">${project.title.charAt(0)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Update navigation
  function updateNavigation() {
    const total = allProjects.length;

    // Previous project
    if (currentIndex > 0) {
      const prevProject = allProjects[currentIndex - 1];
      elements.prevTitle.textContent = prevProject.title;
      elements.prevProject.href = `detail.html?id=${prevProject.id}`;
      elements.prevProject.classList.remove('disabled');
    } else {
      elements.prevTitle.textContent = '没有更多';
      elements.prevProject.href = '#';
      elements.prevProject.classList.add('disabled');
    }

    // Next project
    if (currentIndex < total - 1) {
      const nextProject = allProjects[currentIndex + 1];
      elements.nextTitle.textContent = nextProject.title;
      elements.nextProject.href = `detail.html?id=${nextProject.id}`;
      elements.nextProject.classList.remove('disabled');
    } else {
      elements.nextTitle.textContent = '没有更多';
      elements.nextProject.href = '#';
      elements.nextProject.classList.add('disabled');
    }
  }

  // Show not found state
  function showNotFound() {
    elements.content.innerHTML = `
      <div class="not-found">
        <div class="not-found-icon">◇</div>
        <h2 class="not-found-title">作品未找到</h2>
        <p class="not-found-text">您访问的作品不存在或已被移除</p>
        <a href="index.html" class="not-found-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回作品集
        </a>
      </div>
    `;
  }

  // Start
  init();
})();
