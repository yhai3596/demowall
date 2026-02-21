/**
 * DEMOWALL - Background Effects Controller
 * Manages dynamic particles, spotlight, and glow lines
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    particles: {
      count: 50,
      minDuration: 15,
      maxDuration: 30,
      maxDrift: 100
    },
    glowLines: {
      count: 8,
      minDuration: 8,
      maxDuration: 15,
      spawnInterval: 3000
    }
  };

  // Initialize background effects
  function init() {
    createParticles();
    createGlowLines();
    initSpotlight();
  }

  // Create floating particles
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);

    for (let i = 0; i < CONFIG.particles.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Random properties
      const duration = randomRange(CONFIG.particles.minDuration, CONFIG.particles.maxDuration);
      const drift = randomRange(-CONFIG.particles.maxDrift, CONFIG.particles.maxDrift);
      const delay = randomRange(0, 10);
      const left = randomRange(0, 100);

      particle.style.left = `${left}%`;
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.setProperty('--drift', `${drift}px`);
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
    }
  }

  // Create glowing lines
  function createGlowLines() {
    const container = document.createElement('div');
    container.className = 'glow-lines';
    document.body.appendChild(container);

    // Spawn lines periodically
    setInterval(() => {
      spawnGlowLine(container);
    }, CONFIG.glowLines.spawnInterval);

    // Initial lines
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnGlowLine(container), i * 1000);
    }
  }

  // Spawn a single glow line
  function spawnGlowLine(container) {
    const line = document.createElement('div');
    line.className = 'glow-line glow-line-horizontal';

    const duration = randomRange(CONFIG.glowLines.minDuration, CONFIG.glowLines.maxDuration);
    const top = randomRange(10, 90);

    line.style.top = `${top}%`;
    line.style.setProperty('--duration', `${duration}s`);

    container.appendChild(line);

    // Remove after animation
    setTimeout(() => {
      line.remove();
    }, duration * 1000);
  }

  // Initialize spotlight that follows mouse
  function initSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight';
    document.body.appendChild(spotlight);

    let mouseX = 0;
    let mouseY = 0;
    let spotlightX = 0;
    let spotlightY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth spotlight movement
    function updateSpotlight() {
      spotlightX += (mouseX - spotlightX) * 0.1;
      spotlightY += (mouseY - spotlightY) * 0.1;

      spotlight.style.transform = `translate(${spotlightX - 300}px, ${spotlightY - 300}px)`;

      requestAnimationFrame(updateSpotlight);
    }

    updateSpotlight();
  }

  // Utility: Random range
  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
