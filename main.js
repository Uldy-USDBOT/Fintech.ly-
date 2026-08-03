/**
 * Al-Khalij Investment Gateway
 * fintech.ly - Main JavaScript
 */

// ============================================
// STATE
// ============================================
let currentLang = 'en';
let isMobileMenuOpen = false;

// ============================================
// LOADING SCREEN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');

  // Hide loading after animation
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
    initApp();
  }, 2200);
});

function initApp() {
  initParticles();
  initScrollReveal();
  initNavbarScroll();
  initCounterAnimation();
  initSmoothScroll();
}

// ============================================
// LANGUAGE TOGGLE
// ============================================
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  document.body.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  updateLanguage();

  // Save preference
  localStorage.setItem('fintech-lang', currentLang);
}

function updateLanguage() {
  // Update all elements with data-en and data-ar
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) {
      // Preserve child elements for elements with mixed content
      if (el.children.length === 0 || el.querySelector('.highlight')) {
        // Check if it has HTML content (like highlight spans)
        const enHTML = el.getAttribute('data-en');
        const arHTML = el.getAttribute('data-ar');
        if (arHTML && currentLang === 'ar') {
          el.innerHTML = arHTML;
        } else if (enHTML && currentLang === 'en') {
          el.innerHTML = enHTML;
        } else {
          el.textContent = text;
        }
      } else {
        el.textContent = text;
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    const enPh = el.getAttribute('data-en-placeholder');
    const arPh = el.getAttribute('data-ar-placeholder');
    if (currentLang === 'ar' && arPh) {
      el.placeholder = arPh;
    } else if (enPh) {
      el.placeholder = enPh;
    }
  });

  // Update select options
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute('data-' + currentLang);
    if (text) opt.textContent = text;
  });
}

// Load saved language
const savedLang = localStorage.getItem('fintech-lang');
if (savedLang) {
  currentLang = savedLang;
  document.body.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  // Wait for DOM then update
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLanguage);
  } else {
    updateLanguage();
  }
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
  isMobileMenuOpen = !isMobileMenuOpen;
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');

  if (menu) menu.classList.toggle('active', isMobileMenuOpen);
  if (overlay) overlay.classList.toggle('active', isMobileMenuOpen);
  document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = target * easeOut;

    if (isDecimal) {
      el.textContent = prefix + current.toFixed(1) + suffix;
    } else {
      el.textContent = prefix + Math.floor(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Final update with exact value
      if (isDecimal) {
        el.textContent = prefix + target.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + target + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// PARTICLES
// ============================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 12 : 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 15) + 's';
    particle.style.opacity = (0.2 + Math.random() * 0.4).toString();

    // Random size
    const size = 2 + Math.random() * 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    container.appendChild(particle);
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// FORM HANDLING
// ============================================
function handleContactSubmit(e) {
  e.preventDefault();
  showModal();
  e.target.reset();
}

function handleInvestSubmit(e) {
  e.preventDefault();
  showModal();
  e.target.reset();
}

// ============================================
// MODAL
// ============================================
function showModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    if (isMobileMenuOpen) toggleMobileMenu();
  }
});

// ============================================
// PLAN SELECTION
// ============================================
function selectPlan(plan) {
  const select = document.getElementById('planSelect');
  if (select) {
    select.value = plan;
    // Scroll to form
    const form = document.getElementById('investForm') || document.querySelector('.invest-form-card');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the select
      select.style.borderColor = 'var(--accent)';
      select.style.boxShadow = '0 0 0 3px var(--accent-glow)';
      setTimeout(() => {
        select.style.borderColor = '';
        select.style.boxShadow = '';
      }, 2000);
    }
  }
}

// ============================================
// PARALLAX EFFECT (subtle)
// ============================================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;

      // Parallax for orbs
      document.querySelectorAll('.orb').forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });

      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ============================================
// ACTIVE NAV LINK
// ============================================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.includes(currentPage)) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ============================================
// COMING SOON POPUP FOR EMPTY LINKS
// ============================================
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    // Create temporary toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 12px 24px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      z-index: 9999;
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = currentLang === 'ar' ? 'قريباً...' : 'Coming Soon...';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
});

console.log('⚡ Al-Khalij Gateway loaded. fintech.ly');
