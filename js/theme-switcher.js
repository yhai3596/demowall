/**
 * DEMOWALL - Theme Switcher
 * Manages theme switching and persistence
 */

(function() {
  'use strict';

  const THEMES = {
    cyberpunk: { name: '赛博朋克', icon: '⚡' },
    minimalist: { name: '极简主义', icon: '◻' },
    vaporwave: { name: '蒸汽波', icon: '🌸' },
    organic: { name: '自然有机', icon: '🌿' },
    pixel: { name: '像素风格', icon: '🎮' }
  };

  const STORAGE_KEY = 'demowall-theme';

  // Initialize theme switcher
  function init() {
    createThemeSwitcher();
    loadSavedTheme();
  }

  // Create theme switcher UI
  function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
      <button class="theme-toggle" id="themeToggle" aria-label="切换主题">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
        </svg>
      </button>
      <div class="theme-menu" id="themeMenu">
        ${Object.entries(THEMES).map(([key, theme]) => `
          <button class="theme-option" data-theme="${key}">
            <span class="theme-icon">${theme.icon}</span>
            <span class="theme-name">${theme.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    document.body.appendChild(switcher);

    // Event listeners
    const toggle = document.getElementById('themeToggle');
    const menu = document.getElementById('themeMenu');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });

    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = option.dataset.theme;
        setTheme(theme);
        menu.classList.remove('show');
      });
    });
  }

  // Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update active state
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === theme);
    });
  }

  // Load saved theme
  function loadSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'cyberpunk';
    setTheme(saved);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
