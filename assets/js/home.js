/**
 * ==========================================================================
 * POTENSIA INC. - HOME PAGE JAVASCRIPT
 * ==========================================================================
 */

'use strict';

/**
 * Home page specific functionality
 */
const PotensiaHome = {
  // Configuration
  config: {
    heroSlideInterval: 4000,
    statsAnimationDelay: 2000,
    newsUpdateInterval: 30000
  },
  
  // State
  state: {
    currentSlide: 0,
    isSliderPlaying: true,
    statsAnimated: false
  },
  
  // Elements cache
  elements: {},
  
  /**
   * Initialize home page
   */
  init() {
    this.cacheElements();
    this.initHeroSlider();
    this.initStatsAnimation();
    this.initServiceCards();
    this.initNewsSection();
    this.bindEvents();
    
    console.log('Home page initialized');
  },
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Hero slider elements
      heroSlides: document.querySelectorAll('[data-hero-slide]'),
      slideIndicators: document.querySelectorAll('[data-slide-indicator]'),
      heroContainer: document.querySelector('[data-hero-container]'),
      
      // Stats elements
      statsSection: document.querySelector('[data-stats-section]'),
      statNumbers: document.querySelectorAll('[data-stat-number]'),
      
      // Service cards
      serviceCards: document.querySelectorAll('[data-service-card]'),
      
      // News section
      newsContainer: document.querySelector('[data-news-container]'),
      newsItems: document.querySelectorAll('[data-news-item]'),
      
      // CTA buttons
      ctaButtons: document.querySelectorAll('[data-cta-button]')
    };
  },
  
  /**
   * Initialize hero slider
   */
  initHeroSlider() {
    if (!this.elements.heroSlides.length) return;
    
    // Set initial slide
    this.showSlide(0);
    
    // Start auto-play
    this.startSlideShow();
    
    // Bind indicator events
    this.elements.slideIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });
    
    // Pause on hover
    if (this.elements.heroContainer) {
      this.elements.heroContainer.addEventListener('mouseenter', () => {
        this.pauseSlideShow();
      });
      
      this.elements.heroContainer.addEventListener('mouseleave', () => {
        this.startSlideShow();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  },
  
  /**
   * Show specific slide
   */
  showSlide(index) {
    // Hide all slides
    this.elements.heroSlides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
    
    // Update indicators
    this.elements.slideIndicators.forEach((indicator, i) => {
      indicator.classList.remove('active');
      if (i === index) {
        indicator.classList.add('active');
      }
    });
    
    this.state.currentSlide = index;
    
    // Trigger slide change event
    this.onSlideChange(index);
  },
  
  /**
   * Go to specific slide
   */
  goToSlide(index) {
    if (index >= 0 && index < this.elements.heroSlides.length) {
      this.showSlide(index);
      this.resetSlideShow();
    }
  },
  
  /**
   * Go to next slide
   */
  nextSlide() {
    const nextIndex = (this.state.currentSlide + 1) % this.elements.heroSlides.length;
    this.showSlide(nextIndex);
  },
  
  /**
   * Go to previous slide
   */
  prevSlide() {
    const prevIndex = this.state.currentSlide === 0 
      ? this.elements.heroSlides.length - 1 
      : this.state.currentSlide - 1;
    this.showSlide(prevIndex);
  },
  
  /**
   * Start slideshow
   */
  startSlideShow() {
    if (this.state.isSliderPlaying) return;
    
    this.state.isSliderPlaying = true;
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.config.heroSlideInterval);
  },
  
  /**
   * Pause slideshow
   */
  pauseSlideShow() {
    this.state.isSliderPlaying = false;
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  },
  
  /**
   * Reset slideshow timer
   */
  resetSlideShow() {
    this.pauseSlideShow();
    setTimeout(() => {
      this.startSlideShow();
    }, 100);
  },
  
  /**
   * Handle slide change
   */
  onSlideChange(index) {
    // Update background gradient
    const slide = this.elements.heroSlides[index];
    if (slide && this.elements.heroContainer) {
      const bgClass = slide.dataset.background;
      if (bgClass) {
        this.elements.heroContainer.className = this.elements.heroContainer.className.replace(/bg-gradient-\w+/g, '');
        this.elements.heroContainer.classList.add(bgClass);
      }
    }
    
    // Animate text content
    this.animateSlideContent(index);
  },
  
  /**
   * Animate slide content
   */
  animateSlideContent(index) {
    const slide = this.elements.heroSlides[index];
    if (!slide) return;
    
    const title = slide.querySelector('[data-slide-title]');
    const subtitle = slide.querySelector('[data-slide-subtitle]');
    const description = slide.querySelector('[data-slide-description]');
    
    // Reset animations
    [title, subtitle, description].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = '';
      }
    });
    
    // Staggered animation
    setTimeout(() => {
      if (title) title.classList.add('animate-fadeInUp');
    }, 100);
    
    setTimeout(() => {
      if (subtitle) subtitle.classList.add('animate-fadeInUp');
    }, 300);
    
    setTimeout(() => {
      if (description) description.classList.add('animate-fadeInUp');
    }, 500);
  },
  
  /**
   * Initialize stats animation
   */
  initStatsAnimation() {
    if (!this.elements.statsSection) return;
    
    // Create intersection observer for stats
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.state.statsAnimated) {
          this.animateStats();
          this.state.statsAnimated = true;
        }
      });
    }, {
      threshold: 0.5
    });
    
    observer.observe(this.elements.statsSection);
  },
  
  /**
   * Animate statistics numbers
   */
  animateStats() {
    this.elements.statNumbers.forEach((stat, index) => {
      setTimeout(() => {
        this.animateStatNumber(stat);
      }, index * 200);
    });
  },
  
  /**
   * Animate individual stat number
   */
  animateStatNumber(element) {
    const finalNumber = element.textContent.replace(/[^\d]/g, '');
    const suffix = element.textContent.replace(/[\d]/g, '');
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    let current = 0;
    
    element.textContent = '0' + suffix;
    element.classList.add('animate-countUp');
    
    const updateNumber = () => {
      current += increment;
      if (current < finalNumber) {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = finalNumber + suffix;
      }
    };
    
    requestAnimationFrame(updateNumber);
  },
  
  /**
   * Initialize service cards
   */
  initServiceCards() {
    this.elements.serviceCards.forEach((card, index) => {
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.onServiceCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.onServiceCardHover(card, false);
      });
      
      // Add click handler
      card.addEventListener('click', () => {
        this.onServiceCardClick(card, index);
      });
      
      // Add intersection observer for animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInUp');
            }, index * 100);
          }
        });
      }, {
        threshold: 0.2
      });
      
      observer.observe(card);
    });
  },
  
  /**
   * Handle service card hover
   */
  onServiceCardHover(card, isHovering) {
    const icon = card.querySelector('[data-service-icon]');
    const title = card.querySelector('[data-service-title]');
    const cta = card.querySelector('[data-service-cta]');
    
    if (isHovering) {
      if (icon) icon.classList.add('animate-pulse');
      if (title) title.classList.add('text-blue-600');
      if (cta) cta.classList.add('opacity-100', 'translate-x-2');
    } else {
      if (icon) icon.classList.remove('animate-pulse');
      if (title) title.classList.remove('text-blue-600');
      if (cta) cta.classList.remove('opacity-100', 'translate-x-2');
    }
  },
  
  /**
   * Handle service card click
   */
  onServiceCardClick(card, index) {
    const serviceType = card.dataset.serviceType;
    
    // Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'service_card_click', {
        service_type: serviceType,
        card_index: index
      });
    }
    
    // Navigate to business page with anchor
    if (serviceType) {
      window.location.href = `/business.html#${serviceType}`;
    }
  },
  
  /**
   * Initialize news section
   */
  initNewsSection() {
    if (!this.elements.newsContainer) return;
    
    // Add click handlers to news items
    this.elements.newsItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.onNewsItemClick(item, index);
      });
      
      // Add animation on scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInUp');
            }, index * 150);
          }
        });
      }, {
        threshold: 0.2
      });
      
      observer.observe(item);
    });
    
    // Auto-refresh news (if connected to API)
    this.setupNewsAutoRefresh();
  },
  
  /**
   * Handle news item click
   */
  onNewsItemClick(item, index) {
    const newsId = item.dataset.newsId;
    const newsTitle = item.querySelector('[data-news-title]')?.textContent;
    
    // Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'news_item_click', {
        news_id: newsId,
        news_title: newsTitle,
        item_index: index
      });
    }
    
    // Navigate to news detail or news page
    if (newsId) {
      window.location.href = `/news.html#${newsId}`;
    } else {
      window.location.href = '/news.html';
    }
  },
  
  /**
   * Setup news auto-refresh
   */
  setupNewsAutoRefresh() {
    // Only refresh if page is visible
    setInterval(() => {
      if (!document.hidden) {
        this.refreshNews();
      }
    }, this.config.newsUpdateInterval);
    
    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshNews();
      }
    });
  },
  
  /**
   * Refresh news content
   */
  async refreshNews() {
    try {
      const response = await POTENSIA.api.get('/news/latest');
      if (response && response.data) {
        this.updateNewsContent(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh news:', error);
    }
  },
  
  /**
   * Update news content
   */
  updateNewsContent(newsData) {
    newsData.forEach((news, index) => {
      const newsItem = this.elements.newsItems[index];
      if (newsItem) {
        const title = newsItem.querySelector('[data-news-title]');
        const date = newsItem.querySelector('[data-news