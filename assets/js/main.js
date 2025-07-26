/**
 * ==========================================================================
 * POTENSIA INC. - MAIN JAVASCRIPT
 * ==========================================================================
 */

'use strict';

/**
 * ==========================================================================
 * GLOBAL VARIABLES
 * ==========================================================================
 */
const POTENSIA = {
  // Configuration
  config: {
    scrollThreshold: 50,
    animationDuration: 300,
    debounceDelay: 16,
    apiBaseUrl: '/api',
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  },
  
  // State management
  state: {
    isScrolled: false,
    isMobileMenuOpen: false,
    currentPage: window.location.pathname,
    scrollY: 0,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  },
  
  // Cache DOM elements
  elements: {},
  
  // Utilities
  utils: {},
  
  // Components
  components: {},
  
  // Animations
  animations: {}
};

/**
 * ==========================================================================
 * UTILITY FUNCTIONS
 * ==========================================================================
 */

// Debounce function
POTENSIA.utils.debounce = function(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function
POTENSIA.utils.throttle = function(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if element is in viewport
POTENSIA.utils.isInViewport = function(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

// Get element offset from top
POTENSIA.utils.getOffset = function(element) {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
};

// Smooth scroll to element
POTENSIA.utils.smoothScrollTo = function(target, duration = 800) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  const targetPosition = POTENSIA.utils.getOffset(targetElement) - 80; // Account for fixed header
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animation);
};

// Get current breakpoint
POTENSIA.utils.getCurrentBreakpoint = function() {
  const width = window.innerWidth;
  const breakpoints = POTENSIA.config.breakpoints;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

// Format number with commas
POTENSIA.utils.formatNumber = function(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Generate unique ID
POTENSIA.utils.generateId = function(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Deep merge objects
POTENSIA.utils.deepMerge = function(target, source) {
  const output = Object.assign({}, target);
  if (POTENSIA.utils.isObject(target) && POTENSIA.utils.isObject(source)) {
    Object.keys(source).forEach(key => {
      if (POTENSIA.utils.isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = POTENSIA.utils.deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

// Check if value is object
POTENSIA.utils.isObject = function(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * ==========================================================================
 * HEADER COMPONENT
 * ==========================================================================
 */
POTENSIA.components.header = {
  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateHeaderState();
  },
  
  cacheElements() {
    this.header = document.querySelector('.header, header');
    this.mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
    this.mobileMenu = document.querySelector('[data-mobile-menu]');
    this.navLinks = document.querySelectorAll('[data-nav-link]');
  },
  
  bindEvents() {
    // Scroll event for header background
    window.addEventListener('scroll', POTENSIA.utils.throttle(() => {
      this.updateHeaderState();
    }, POTENSIA.config.debounceDelay));
    
    // Mobile menu toggle
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }
    
    // Close mobile menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (POTENSIA.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });
    
    // Close mobile menu on resize
    window.addEventListener('resize', POTENSIA.utils.debounce(() => {
      if (window.innerWidth >= POTENSIA.config.breakpoints.md) {
        this.closeMobileMenu();
      }
    }, 250));
  },
  
  updateHeaderState() {
    const scrollY = window.pageYOffset;
    const shouldBeScrolled = scrollY > POTENSIA.config.scrollThreshold;
    
    if (shouldBeScrolled !== POTENSIA.state.isScrolled) {
      POTENSIA.state.isScrolled = shouldBeScrolled;
      
      if (this.header) {
        if (shouldBeScrolled) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
    }
    
    POTENSIA.state.scrollY = scrollY;
  },
  
  toggleMobileMenu() {
    if (POTENSIA.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },
  
  openMobileMenu() {
    POTENSIA.state.isMobileMenuOpen = true;
    
    if (this.mobileMenu) {
      this.mobileMenu.classList.add('open');
    }
    
    if (this.mobileMenuButton) {
      this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    }
    
    document.body.style.overflow = 'hidden';
  },
  
  closeMobileMenu() {
    POTENSIA.state.isMobileMenuOpen = false;
    
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('open');
    }
    
    if (this.mobileMenuButton) {
      this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
    
    document.body.style.overflow = '';
  }
};

/**
 * ==========================================================================
 * SMOOTH SCROLL COMPONENT
 * ==========================================================================
 */
POTENSIA.components.smoothScroll = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      POTENSIA.utils.smoothScrollTo(target);
    });
  }
};

/**
 * ==========================================================================
 * SCROLL ANIMATIONS COMPONENT
 * ==========================================================================
 */
POTENSIA.components.scrollAnimations = {
  init() {
    this.elements = document.querySelectorAll('[data-scroll-animation]');
    this.bindEvents();
    this.checkElements();
  },
  
  bindEvents() {
    window.addEventListener('scroll', POTENSIA.utils.throttle(() => {
      this.checkCounters();
    }, POTENSIA.config.debounceDelay));
  },
  
  checkCounters() {
    this.counters.forEach(counter => {
      if (POTENSIA.utils.isInViewport(counter) && !counter.classList.contains('counted')) {
        this.animateCounter(counter);
      }
    });
  },
  
  animateCounter(element) {
    element.classList.add('counted');
    const target = parseInt(element.dataset.counter);
    const duration = parseInt(element.dataset.duration) || 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    updateCounter();
  }
};

/**
 * ==========================================================================
 * FORM COMPONENT
 * ==========================================================================
 */
POTENSIA.components.forms = {
  init() {
    this.forms = document.querySelectorAll('form[data-form]');
    this.bindEvents();
  },
  
  bindEvents() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        this.handleSubmit(e, form);
      });
      
      // Input validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    });
  },
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    if (!this.validateForm(form)) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    this.submitForm(form, data);
  },
  
  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  },
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (required && !value) {
      isValid = false;
      errorMessage = '이 필드는 필수입니다.';
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '올바른 이메일 주소를 입력해주세요.';
      }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[0-9-+\s()]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = '올바른 전화번호를 입력해주세요.';
      }
    }
    
    // Min length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      isValid = false;
      errorMessage = `최소 ${minLength}자 이상 입력해주세요.`;
    }
    
    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  },
  
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    if (message) {
      field.classList.add('error');
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error text-red-500 text-sm mt-1';
      errorElement.textContent = message;
      field.parentNode.appendChild(errorElement);
    }
  },
  
  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  },
  
  async submitForm(form, data) {
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';
    submitButton.classList.add('loading');
    
    try {
      const response = await fetch(form.action || '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        this.showSuccess(form, '메시지가 성공적으로 전송되었습니다.');
        form.reset();
      } else {
        throw new Error('전송에 실패했습니다.');
      }
    } catch (error) {
      this.showError(form, error.message);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      submitButton.classList.remove('loading');
    }
  },
  
  showSuccess(form, message) {
    this.showMessage(form, message, 'success');
  },
  
  showError(form, message) {
    this.showMessage(form, message, 'error');
  },
  
  showMessage(form, message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type} p-4 rounded-lg mb-4 ${
      type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`;
    messageElement.textContent = message;
    
    form.insertBefore(messageElement, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
};

/**
 * ==========================================================================
 * MODAL COMPONENT
 * ==========================================================================
 */
POTENSIA.components.modal = {
  init() {
    this.modals = document.querySelectorAll('[data-modal]');
    this.triggers = document.querySelectorAll('[data-modal-trigger]');
    this.bindEvents();
  },
  
  bindEvents() {
    // Trigger events
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modalTrigger;
        this.openModal(modalId);
      });
    });
    
    // Close events
    this.modals.forEach(modal => {
      const closeButton = modal.querySelector('[data-modal-close]');
      const overlay = modal.querySelector('[data-modal-overlay]');
      
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.closeModal(modal.dataset.modal);
        });
      }
      
      if (overlay) {
        overlay.addEventListener('click', () => {
          this.closeModal(modal.dataset.modal);
        });
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeActiveModal();
      }
    });
  },
  
  openModal(modalId) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  },
  
  closeModal(modalId) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },
  
  closeActiveModal() {
    const activeModal = document.querySelector('[data-modal].active');
    if (activeModal) {
      this.closeModal(activeModal.dataset.modal);
    }
  }
};

/**
 * ==========================================================================
 * LAZY LOADING COMPONENT
 * ==========================================================================
 */
POTENSIA.components.lazyLoading = {
  init() {
    this.images = document.querySelectorAll('img[data-src]');
    this.observer = null;
    this.setupIntersectionObserver();
    this.observeImages();
  },
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, options);
  },
  
  observeImages() {
    this.images.forEach(img => {
      this.observer.observe(img);
    });
  },
  
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    img.src = src;
    img.classList.add('loaded');
    img.removeAttribute('data-src');
    this.observer.unobserve(img);
  }
};

/**
 * ==========================================================================
 * PERFORMANCE MONITORING
 * ==========================================================================
 */
POTENSIA.performance = {
  init() {
    this.measurePageLoadTime();
    this.measureFirstContentfulPaint();
  },
  
  measurePageLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  },
  
  measureFirstContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${entry.startTime}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }
};

/**
 * ==========================================================================
 * ACCESSIBILITY HELPERS
 * ==========================================================================
 */
POTENSIA.accessibility = {
  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
  },
  
  setupKeyboardNavigation() {
    // Skip to main content
    const skipLink = document.querySelector('[data-skip-link]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }
    
    // Tab key navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  },
  
  setupFocusManagement() {
    // Focus trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const activeModal = document.querySelector('[data-modal].active');
        if (activeModal) {
          this.trapFocus(e, activeModal);
        }
      }
    });
  },
  
  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  },
  
  setupScreenReaderSupport() {
    // Announce dynamic content changes
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    document.body.appendChild(this.announcer);
  },
  
  announce(message) {
    this.announcer.textContent = message;
    setTimeout(() => {
      this.announcer.textContent = '';
    }, 1000);
  }
};

/**
 * ==========================================================================
 * API UTILITIES
 * ==========================================================================
 */
POTENSIA.api = {
  async request(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const config = { ...defaultOptions, ...options };
    const url = `${POTENSIA.config.apiBaseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

/**
 * ==========================================================================
 * INITIALIZATION
 * ==========================================================================
 */
POTENSIA.init = function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeComponents();
    });
  } else {
    this.initializeComponents();
  }
  
  // Initialize performance monitoring
  this.performance.init();
};

POTENSIA.initializeComponents = function() {
  // Initialize all components
  this.components.header.init();
  this.components.smoothScroll.init();
  this.components.scrollAnimations.init();
  this.components.counterAnimation.init();
  this.components.forms.init();
  this.components.modal.init();
  this.components.lazyLoading.init();
  this.accessibility.init();
  
  // Update window dimensions on resize
  window.addEventListener('resize', POTENSIA.utils.debounce(() => {
    POTENSIA.state.windowWidth = window.innerWidth;
    POTENSIA.state.windowHeight = window.innerHeight;
  }, 250));
  
  // Log initialization
  console.log('Potensia website initialized successfully');
};

/**
 * ==========================================================================
 * EXPORT FOR MODULE USAGE
 * ==========================================================================
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = POTENSIA;
}

// Auto-initialize
POTENSIA.init();utils.throttle(() => {
      this.checkElements();
    }, POTENSIA.config.debounceDelay));
  },
  
  checkElements() {
    this.elements.forEach(element => {
      if (POTENSIA.utils.isInViewport(element, 100)) {
        const animation = element.dataset.scrollAnimation;
        element.classList.add('in-view', `animate-${animation}`);
      }
    });
  }
};

/**
 * ==========================================================================
 * COUNTER ANIMATION COMPONENT
 * ==========================================================================
 */
POTENSIA.components.counterAnimation = {
  init() {
    this.counters = document.querySelectorAll('[data-counter]');
    this.bindEvents();
  },
  
  bindEvents() {
    window.addEventListener('scroll', POTENSIA.