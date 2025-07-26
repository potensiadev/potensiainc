/**
 * ==========================================================================
 * POTENSIA INC. - REUSABLE COMPONENTS
 * ==========================================================================
 */

'use strict';

/**
 * Reusable component library
 */
const PotensiaComponents = {
  /**
   * Initialize all components
   */
  init() {
    this.Slider.init();
    this.Tabs.init();
    this.Accordion.init();
    this.Tooltip.init();
    this.Dropdown.init();
    this.Modal.init();
    this.Toast.init();
    this.LoadingSpinner.init();
    this.ImageGallery.init();
    this.ContactForm.init();
    
    console.log('Potensia components initialized');
  },

  /**
   * ==========================================================================
   * SLIDER COMPONENT
   * ==========================================================================
   */
  Slider: {
    sliders: [],
    
    init() {
      const sliderElements = document.querySelectorAll('[data-slider]');
      sliderElements.forEach(slider => {
        this.create(slider);
      });
    },
    
    create(element) {
      const slider = {
        element: element,
        slides: element.querySelectorAll('[data-slide]'),
        prevButton: element.querySelector('[data-slider-prev]'),
        nextButton: element.querySelector('[data-slider-next]'),
        indicators: element.querySelectorAll('[data-slider-indicator]'),
        currentSlide: 0,
        autoplay: element.dataset.autoplay === 'true',
        interval: parseInt(element.dataset.interval) || 5000,
        intervalId: null
      };
      
      this.setupSlider(slider);
      this.sliders.push(slider);
      
      return slider;
    },
    
    setupSlider(slider) {
      // Navigation buttons
      if (slider.prevButton) {
        slider.prevButton.addEventListener('click', () => {
          this.prevSlide(slider);
        });
      }
      
      if (slider.nextButton) {
        slider.nextButton.addEventListener('click', () => {
          this.nextSlide(slider);
        });
      }
      
      // Indicators
      slider.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          this.goToSlide(slider, index);
        });
      });
      
      // Touch/swipe support
      this.setupTouchEvents(slider);
      
      // Keyboard navigation
      slider.element.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide(slider);
        } else if (e.key === 'ArrowRight') {
          this.nextSlide(slider);
        }
      });
      
      // Autoplay
      if (slider.autoplay) {
        this.startAutoplay(slider);
        
        // Pause on hover
        slider.element.addEventListener('mouseenter', () => {
          this.stopAutoplay(slider);
        });
        
        slider.element.addEventListener('mouseleave', () => {
          this.startAutoplay(slider);
        });
      }
      
      // Initialize first slide
      this.updateSlide(slider);
    },
    
    setupTouchEvents(slider) {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      
      slider.element.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      });
      
      slider.element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
      });
      
      slider.element.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            this.nextSlide(slider);
          } else {
            this.prevSlide(slider);
          }
        }
        
        isDragging = false;
      });
    },
    
    goToSlide(slider, index) {
      slider.currentSlide = index;
      this.updateSlide(slider);
      this.resetAutoplay(slider);
    },
    
    nextSlide(slider) {
      slider.currentSlide = (slider.currentSlide + 1) % slider.slides.length;
      this.updateSlide(slider);
      this.resetAutoplay(slider);
    },
    
    prevSlide(slider) {
      slider.currentSlide = slider.currentSlide === 0 
        ? slider.slides.length - 1 
        : slider.currentSlide - 1;
      this.updateSlide(slider);
      this.resetAutoplay(slider);
    },
    
    updateSlide(slider) {
      // Update slides
      slider.slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slider.currentSlide);
      });
      
      // Update indicators
      slider.indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slider.currentSlide);
      });
      
      // Emit custom event
      const event = new CustomEvent('sliderChange', {
        detail: { currentSlide: slider.currentSlide, slider }
      });
      slider.element.dispatchEvent(event);
    },
    
    startAutoplay(slider) {
      if (!slider.autoplay) return;
      
      slider.intervalId = setInterval(() => {
        this.nextSlide(slider);
      }, slider.interval);
    },
    
    stopAutoplay(slider) {
      if (slider.intervalId) {
        clearInterval(slider.intervalId);
        slider.intervalId = null;
      }
    },
    
    resetAutoplay(slider) {
      this.stopAutoplay(slider);
      this.startAutoplay(slider);
    }
  },

  /**
   * ==========================================================================
   * TABS COMPONENT
   * ==========================================================================
   */
  Tabs: {
    init() {
      const tabContainers = document.querySelectorAll('[data-tabs]');
      tabContainers.forEach(container => {
        this.create(container);
      });
    },
    
    create(container) {
      const tabs = container.querySelectorAll('[data-tab]');
      const panels = container.querySelectorAll('[data-tab-panel]');
      
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchTab(tabs, panels, index);
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
          const currentIndex = Array.from(tabs).indexOf(tab);
          let nextIndex = currentIndex;
          
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % tabs.length;
            e.preventDefault();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
            e.preventDefault();
          } else if (e.key === 'Home') {
            nextIndex = 0;
            e.preventDefault();
          } else if (e.key === 'End') {
            nextIndex = tabs.length - 1;
            e.preventDefault();
          }
          
          if (nextIndex !== currentIndex) {
            tabs[nextIndex].focus();
            this.switchTab(tabs, panels, nextIndex);
          }
        });
      });
      
      // Initialize first tab
      this.switchTab(tabs, panels, 0);
    },
    
    switchTab(tabs, panels, activeIndex) {
      // Update tabs
      tabs.forEach((tab, index) => {
        const isActive = index === activeIndex;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive.toString());
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      
      // Update panels
      panels.forEach((panel, index) => {
        const isActive = index === activeIndex;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
      
      // Emit custom event
      const event = new CustomEvent('tabChange', {
        detail: { activeIndex, activeTab: tabs[activeIndex] }
      });
      tabs[activeIndex].closest('[data-tabs]').dispatchEvent(event);
    }
  },

  /**
   * ==========================================================================
   * ACCORDION COMPONENT
   * ==========================================================================
   */
  Accordion: {
    init() {
      const accordions = document.querySelectorAll('[data-accordion]');
      accordions.forEach(accordion => {
        this.create(accordion);
      });
    },
    
    create(accordion) {
      const items = accordion.querySelectorAll('[data-accordion-item]');
      const allowMultiple = accordion.dataset.multiple === 'true';
      
      items.forEach((item, index) => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        const content = item.querySelector('[data-accordion-content]');
        
        if (!trigger || !content) return;
        
        // Setup ARIA attributes
        const triggerId = `accordion-trigger-${index}`;
        const contentId = `accordion-content-${index}`;
        
        trigger.id = triggerId;
        content.id = contentId;
        trigger.setAttribute('aria-controls', contentId);
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-labelledby', triggerId);
        content.hidden = true;
        
        trigger.addEventListener('click', () => {
          this.toggle(item, allowMultiple ? null : items);
        });
        
        // Keyboard navigation
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle(item, allowMultiple ? null : items);
          }
        });
      });
    },
    
    toggle(item, allItems = null) {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close other items if not allowing multiple
      if (allItems && !isExpanded) {
        allItems.forEach(otherItem => {
          if (otherItem !== item) {
            this.close(otherItem);
          }
        });
      }
      
      if (isExpanded) {
        this.close(item);
      } else {
        this.open(item);
      }
    },
    
    open(item) {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      
      trigger.setAttribute('aria-expanded', 'true');
      content.hidden = false;
      item.classList.add('active');
      
      // Animate
      content.style.height = '0px';
      content.style.overflow = 'hidden';
      content.style.transition = 'height 0.3s ease';
      
      requestAnimationFrame(() => {
        content.style.height = content.scrollHeight + 'px';
      });
      
      setTimeout(() => {
        content.style.height = 'auto';
        content.style.overflow = 'visible';
      }, 300);
    },
    
    close(item) {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      
      trigger.setAttribute('aria-expanded', 'false');
      item.classList.remove('active');
      
      // Animate
      content.style.height = content.scrollHeight + 'px';
      content.style.overflow = 'hidden';
      content.style.transition = 'height 0.3s ease';
      
      requestAnimationFrame(() => {
        content.style.height = '0px';
      });
      
      setTimeout(() => {
        content.hidden = true;
        content.style.height = '';
        content.style.overflow = '';
      }, 300);
    }
  },

  /**
   * ==========================================================================
   * TOOLTIP COMPONENT
   * ==========================================================================
   */
  Tooltip: {
    init() {
      const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
      tooltipTriggers.forEach(trigger => {
        this.create(trigger);
      });
    },
    
    create(trigger) {
      const content = trigger.dataset.tooltip;
      const position = trigger.dataset.tooltipPosition || 'top';
      
      let tooltip = null;
      let showTimeout = null;
      let hideTimeout = null;
      
      const show = () => {
        clearTimeout(hideTimeout);
        showTimeout = setTimeout(() => {
          tooltip = this.createTooltipElement(content, position);
          document.body.appendChild(tooltip);
          this.positionTooltip(tooltip, trigger, position);
          
          requestAnimationFrame(() => {
            tooltip.classList.add('visible');
          });
        }, 500);
      };
      
      const hide = () => {
        clearTimeout(showTimeout);
        if (tooltip) {
          hideTimeout = setTimeout(() => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
              if (tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
              }
              tooltip = null;
            }, 200);
          }, 100);
        }
      };
      
      trigger.addEventListener('mouseenter', show);
      trigger.addEventListener('mouseleave', hide);
      trigger.addEventListener('focus', show);
      trigger.addEventListener('blur', hide);
    },
    
    createTooltipElement(content, position) {
      const tooltip = document.createElement('div');
      tooltip.className = `tooltip tooltip-${position}`;
      tooltip.textContent = content;
      tooltip.setAttribute('role', 'tooltip');
      
      // Add styles
      Object.assign(tooltip.style, {
        position: 'absolute',
        zIndex: '1000',
        padding: '8px 12px',
        backgroundColor: '#1f2937',
        color: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        opacity: '0',
        transform: 'scale(0.8)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none'
      });
      
      return tooltip;
    },
    
    positionTooltip(tooltip, trigger, position) {
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const scrollTop = window.pageYOffset;
      const scrollLeft = window.pageXOffset;
      
      let top, left;
      
      switch (position) {
        case 'top':
          top = triggerRect.top + scrollTop - tooltipRect.height - 8;
          left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollTop + 8;
          left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + scrollLeft + 8;
          break;
      }
      
      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 0) left = 8;
      if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
      if (top < scrollTop) top = scrollTop + 8;
      if (top + tooltipRect.height > scrollTop + viewportHeight) top = scrollTop + viewportHeight - tooltipRect.height - 8;
      
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'scale(1)';
    }
  },

  /**
   * ==========================================================================
   * DROPDOWN COMPONENT
   * ==========================================================================
   */
  Dropdown: {
    init() {
      const dropdowns = document.querySelectorAll('[data-dropdown]');
      dropdowns.forEach(dropdown => {
        this.create(dropdown);
      });
      
      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        const openDropdown = document.querySelector('[data-dropdown].open');
        if (openDropdown && !openDropdown.contains(e.target)) {
          this.close(openDropdown);
        }
      });
    },
    
    create(dropdown) {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      
      if (!trigger || !menu) return;
      
      // Setup ARIA attributes
      const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;
      menu.id = menuId;
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', menuId);
      
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle(dropdown);
      });
      
      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.open(dropdown);
          this.focusFirstItem(menu);
        }
      });
      
      menu.addEventListener('keydown', (e) => {
        this.handleMenuKeydown(e, dropdown);
      });
    },
    
    toggle(dropdown) {
      if (dropdown.classList.contains('open')) {
        this.close(dropdown);
      } else {
        this.open(dropdown);
      }
    },
    
    open(dropdown) {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
      
      // Position menu
      this.positionMenu(dropdown);
      
      // Animate
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px)';
      menu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      
      requestAnimationFrame(() => {
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
      });
    },
    
    close(dropdown) {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        menu.hidden = true;
        menu.style.opacity = '';
        menu.style.transform = '';
      }, 200);
    },
    
    positionMenu(dropdown) {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      const triggerRect = trigger.getBoundingClientRect();
      
      // Reset position
      menu.style.position = 'absolute';
      menu.style.top = '100%';
      menu.style.left = '0';
      menu.style.right = 'auto';
      
      // Check if menu goes outside viewport
      const menuRect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (menuRect.right > viewportWidth) {
        menu.style.left = 'auto';
        menu.style.right = '0';
      }
    },
    
    focusFirstItem(menu) {
      const firstItem = menu.querySelector('a, button, [tabindex]');
      if (firstItem) {
        firstItem.focus();
      }
    },
    
    handleMenuKeydown(e, dropdown) {
      const menu = dropdown.querySelector('[data-dropdown-menu]');
      const items = menu.querySelectorAll('a, button, [tabindex]');
      const currentIndex = Array.from(items).indexOf(document.activeElement);
      
      if (e.key === 'Escape') {
        this.close(dropdown);
        dropdown.querySelector('[data-dropdown-trigger]').focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        items[prevIndex].focus();
      }
    }
  },

  /**
   * ==========================================================================
   * MODAL COMPONENT
   * ==========================================================================
   */
  Modal: {
    init() {
      const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const modalId = trigger.dataset.modalTrigger;
          this.open(modalId);
        });
      });
      
      // Close modal events
      document.addEventListener('click', (e) => {
        const closeButton = e.target.closest('[data-modal-close]');
        if (closeButton) {
          e.preventDefault();
          const modal = closeButton.closest('[data-modal]');
          if (modal) {
            this.close(modal.dataset.modal);
          }
        }
        
        const overlay = e.target.closest('[data-modal-overlay]');
        if (overlay) {
          const modal = overlay.closest('[data-modal]');
          if (modal) {
            this.close(modal.dataset.modal);
          }
        }
      });
      
      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const activeModal = document.querySelector('[data-modal].active');
          if (activeModal) {
            this.close(activeModal.dataset.modal);
          }
        }
      });
    },
    
    open(modalId) {
      const modal = document.querySelector(`[data-modal="${modalId}"]`);
      if (!modal) return;
      
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      this.trapFocus(modal);
      
      // Animate
      const content = modal.querySelector('[data-modal-content]');
      if (content) {
        content.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        requestAnimationFrame(() => {
          content.style.opacity = '1';
          content.style.transform = 'scale(1)';
        });
      }
      
      // Emit event
      const event = new CustomEvent('modalOpen', { detail: { modalId } });
      modal.dispatchEvent(event);
    },
    
    close(modalId) {
      const modal = document.querySelector(`[data-modal="${modalId}"]`);
      if (!modal) return;
      
      const content = modal.querySelector('[data-modal-content]');
      if (content) {
        content.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
      }
      
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        
        if (content) {
          content.style.opacity = '';
          content.style.transform = '';
        }
      }, 300);
      
      // Emit event
      const event = new CustomEvent('modalClose', { detail: { modalId } });
      modal.dispatchEvent(event);
    },
    
    trapFocus(modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Focus first element
      if (firstElement) {
        setTimeout(() => firstElement.focus(), 100);
      }
      
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
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
        }
      });
    }
  },

  /**
   * ==========================================================================
   * TOAST COMPONENT
   * ==========================================================================
   */
  Toast: {
    container: null,
    
    init() {
      this.createContainer();
    },
    
    createContainer() {
      this.container = document.createElement('div');
      this.container.className = 'toast-container fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 5000) {
      const toast = this.createToast(message, type);
      this.container.appendChild(toast);
      
      // Animate in
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
      
      // Auto-remove
      setTimeout(() => {
        this.remove(toast);
      }, duration);
      
      return toast;
    },
    
    createToast(message, type) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} transform translate-x-full transition-transform duration-300 ease-in-out`;
      
      const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      };
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toast.innerHTML = `
        <div class="${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-80">
          <span class="text-lg font-bold">${icons[type]}</span>
          <span class="flex-1">${message}</span>
          <button class="text-white hover:text-gray-200 font-bold text-lg" onclick="this.closest('.toast').remove()">×</button>
        </div>
      `;
      
      return toast;
    },
    
    remove(toast) {
      toast.classList.remove('show');
      toast.classList.add('translate-x-full');
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    },
    
    success(message, duration) {
      return this.show(message, 'success', duration);
    },
    
    error(message, duration) {
      return this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
      return this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
      return this.show(message, 'info', duration);
    }
  },

  /**
   * ==========================================================================
   * LOADING SPINNER COMPONENT
   * ==========================================================================
   */
  LoadingSpinner: {
    init() {
      // Auto-show for elements with data-loading attribute
      const loadingElements = document.querySelectorAll('[data-loading]');
      loadingElements.forEach(element => {
        this.show(element);
      });
    },
    
    show(element, text = '로딩 중...') {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (!element) return;
      
      const spinner = this.createSpinner(text);
      element.appendChild(spinner);
      element.classList.add('loading');
      
      return spinner;
    },
    
    hide(element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (!element) return;
      
      const spinner = element.querySelector('.loading-spinner');
      if (spinner) {
        spinner.remove();
      }
      
      element.classList.remove('loading');
    },
    
    createSpinner(text) {
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner absolute inset-0 flex items-center justify-center bg-white bg-opacity-90';
      
      spinner.innerHTML = `
        <div class="flex flex-col items-center space-y-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="text-sm text-gray-600">${text}</span>
        </div>
      `;
      
      return spinner;
    }
  },

  /**
   * ==========================================================================
   * IMAGE GALLERY COMPONENT
   * ==========================================================================
   */
  ImageGallery: {
    init() {
      const galleries = document.querySelectorAll('[data-gallery]');
      galleries.forEach(gallery => {
        this.create(gallery);
      });
    },
    
    create(gallery) {
      const images = gallery.querySelectorAll('[data-gallery-item]');
      
      images.forEach((image, index) => {
        image.addEventListener('click', () => {
          this.openLightbox(images, index);
        });
      });
    },
    
    openLightbox(images, startIndex) {
      const lightbox = this.createLightbox(images, startIndex);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Focus management
      lightbox.focus();
    },
    
    createLightbox(images, startIndex) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center';
      lightbox.tabIndex = -1;
      
      let currentIndex = startIndex;
      
      const updateImage = () => {
        const img = lightbox.querySelector('.lightbox-image');
        const counter = lightbox.querySelector('.lightbox-counter');
        
        img.src = images[currentIndex].src;
        img.alt = images[currentIndex].alt;
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
      };
      
      lightbox.innerHTML = `
        <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10" data-lightbox-close>×</button>
        <button class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10" data-lightbox-prev>‹</button>
        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10" data-lightbox-next>›</button>
        <img class="lightbox-image max-w-full max-h-full object-contain" src="${images[currentIndex].src}" alt="${images[currentIndex].alt}">
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          <span class="lightbox-counter">${currentIndex + 1} / ${images.length}</span>
        </div>
      `;
      
      // Event listeners
      lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => {
        this.closeLightbox(lightbox);
      });
      
      lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateImage();
      });
      
      lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
      });
      
      // Keyboard navigation
      lightbox.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeLightbox(lightbox);
        } else if (e.key === 'ArrowLeft') {
          currentIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
          updateImage();
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % images.length;
          updateImage();
        }
      });
      
      // Close on backdrop click
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          this.closeLightbox(lightbox);
        }
      });
      
      return lightbox;
    },
    
    closeLightbox(lightbox) {
      document.body.style.overflow = '';
      lightbox.remove();
    }
  },

  /**
   * ==========================================================================
   * CONTACT FORM COMPONENT
   * ==========================================================================
   */
  ContactForm: {
    init() {
      const forms = document.querySelectorAll('[data-contact-form]');
      forms.forEach(form => {
        this.create(form);
      });
    },
    
    create(form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    },
    
    async handleSubmit(form) {
      if (!this.validateForm(form)) return;
      
      const submitButton = form.querySelector('[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Show loading
      const spinner = PotensiaComponents.LoadingSpinner.show(submitButton, '전송 중...');
      submitButton.disabled = true;
      
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Submit to API
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          PotensiaComponents.Toast.success('메시지가 성공적으로 전송되었습니다!');
          form.reset();
        } else {
          throw new Error('전송에 실패했습니다.');
        }
      } catch (error) {
        PotensiaComponents.Toast.error(error.message);
      } finally {
        PotensiaComponents.LoadingSpinner.hide(submitButton);
        submitButton.disabled = false;
      }
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
    }
  }
};

/**
 * ==========================================================================
 * CSS STYLES FOR COMPONENTS
 * ==========================================================================
 */
const componentStyles = `
  <style>
    .toast.show {
      transform: translateX(0);
    }
    
    .tooltip.visible {
      opacity: 1 !important;
      transform: scale(1) !important;
    }
    
    .loading-spinner {
      z-index: 10;
    }
    
    .lightbox img {
      transition: transform 0.3s ease;
    }
    
    .lightbox button {
      transition: all 0.2s ease;
    }
    
    .lightbox button:hover {
      transform: scale(1.1);
    }
    
    .modal-open {
      overflow: hidden;
    }
    
    [data-dropdown].open [data-dropdown-menu] {
      display: block;
    }
    
    [data-tabs] [data-tab].active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }
    
    [data-accordion-item].active [data-accordion-trigger] {
      color: #2563eb;
    }
    
    .field-error {
      animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  </style>
`;

// Inject styles
if (!document.querySelector('#component-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'component-styles';
  styleElement.textContent = componentStyles.replace(/<\/?style>/g, '');
  document.head.appendChild(styleElement);
}

/**
 * ==========================================================================
 * AUTO-INITIALIZATION
 * ==========================================================================
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PotensiaComponents.init();
  });
} else {
  PotensiaComponents.init();
}

// Export for global access
window.PotensiaComponents = PotensiaComponents;