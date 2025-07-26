/**
 * ==========================================================================
 * POTENSIA INC. - ABOUT PAGE JAVASCRIPT
 * ==========================================================================
 */

'use strict';

/**
 * About page specific functionality
 */
const PotensiaAbout = {
  // Configuration
  config: {
    timelineAnimationDelay: 200,
    teamMemberLoadDelay: 300,
    achievementCountDuration: 2000
  },
  
  // State
  state: {
    activeTimelineItem: 0,
    timelineAnimated: false,
    achievementsAnimated: false,
    currentTeamMember: 0
  },
  
  // Elements cache
  elements: {},
  
  /**
   * Initialize about page
   */
  init() {
    this.cacheElements();
    this.initTimelineAnimation();
    this.initTeamSection();
    this.initAchievements();
    this.initValueCards();
    this.initContactCTA();
    this.bindEvents();
    
    console.log('About page initialized');
  },
  
  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Timeline elements
      timelineSection: document.querySelector('[data-timeline-section]'),
      timelineItems: document.querySelectorAll('[data-timeline-item]'),
      timelineLine: document.querySelector('[data-timeline-line]'),
      
      // Team elements
      teamSection: document.querySelector('[data-team-section]'),
      teamMembers: document.querySelectorAll('[data-team-member]'),
      teamModal: document.querySelector('[data-team-modal]'),
      
      // Achievement elements
      achievementSection: document.querySelector('[data-achievement-section]'),
      achievementNumbers: document.querySelectorAll('[data-achievement-number]'),
      
      // Value cards
      valueCards: document.querySelectorAll('[data-value-card]'),
      
      // Vision/Mission
      visionSection: document.querySelector('[data-vision-section]'),
      missionSection: document.querySelector('[data-mission-section]'),
      
      // CEO message
      ceoMessage: document.querySelector('[data-ceo-message]'),
      
      // Contact CTA
      contactCTA: document.querySelector('[data-contact-cta]')
    };
  },
  
  /**
   * Initialize timeline animation
   */
  initTimelineAnimation() {
    if (!this.elements.timelineSection) return;
    
    // Create intersection observer for timeline
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.state.timelineAnimated) {
          this.animateTimeline();
          this.state.timelineAnimated = true;
        }
      });
    }, {
      threshold: 0.3
    });
    
    observer.observe(this.elements.timelineSection);
    
    // Scroll-based timeline progress
    this.setupTimelineScrollProgress();
  },
  
  /**
   * Animate timeline items
   */
  animateTimeline() {
    this.elements.timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-fadeInUp', 'opacity-100');
        
        // Animate timeline dot
        const dot = item.querySelector('[data-timeline-dot]');
        if (dot) {
          dot.classList.add('animate-scaleIn');
        }
        
        // Animate content
        const content = item.querySelector('[data-timeline-content]');
        if (content) {
          content.classList.add('animate-slideInLeft');
        }
      }, index * this.config.timelineAnimationDelay);
    });
    
    // Animate timeline line
    if (this.elements.timelineLine) {
      this.elements.timelineLine.classList.add('animate-timeline-line');
    }
  },
  
  /**
   * Setup timeline scroll progress
   */
  setupTimelineScrollProgress() {
    if (!this.elements.timelineSection) return;
    
    const updateTimelineProgress = () => {
      const sectionRect = this.elements.timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on section visibility
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - sectionRect.top) / (windowHeight + sectionRect.height)
      ));
      
      // Update active timeline item
      const activeIndex = Math.floor(progress * this.elements.timelineItems.length);
      this.updateActiveTimelineItem(activeIndex);
      
      // Update timeline line progress
      if (this.elements.timelineLine) {
        this.elements.timelineLine.style.transform = `scaleY(${progress})`;
      }
    };
    
    window.addEventListener('scroll', POTENSIA.utils.throttle(updateTimelineProgress, 16));
  },
  
  /**
   * Update active timeline item
   */
  updateActiveTimelineItem(index) {
    if (index === this.state.activeTimelineItem) return;
    
    this.state.activeTimelineItem = index;
    
    this.elements.timelineItems.forEach((item, i) => {
      if (i <= index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },
  
  /**
   * Initialize team section
   */
  initTeamSection() {
    if (!this.elements.teamMembers.length) return;
    
    // Add click handlers for team members
    this.elements.teamMembers.forEach((member, index) => {
      member.addEventListener('click', () => {
        this.showTeamMemberDetail(index);
      });
      
      // Add hover effects
      member.addEventListener('mouseenter', () => {
        this.onTeamMemberHover(member, true);
      });
      
      member.addEventListener('mouseleave', () => {
        this.onTeamMemberHover(member, false);
      });
      
      // Add scroll animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInUp');
            }, index * this.config.teamMemberLoadDelay);
          }
        });
      }, {
        threshold: 0.2
      });
      
      observer.observe(member);
    });
  },
  
  /**
   * Handle team member hover
   */
  onTeamMemberHover(member, isHovering) {
    const image = member.querySelector('[data-member-image]');
    const overlay = member.querySelector('[data-member-overlay]');
    const info = member.querySelector('[data-member-info]');
    
    if (isHovering) {
      if (image) image.classList.add('scale-110');
      if (overlay) overlay.classList.add('opacity-100');
      if (info) info.classList.add('translate-y-0', 'opacity-100');
    } else {
      if (image) image.classList.remove('scale-110');
      if (overlay) overlay.classList.remove('opacity-100');
      if (info) info.classList.remove('translate-y-0', 'opacity-100');
    }
  },
  
  /**
   * Show team member detail
   */
  showTeamMemberDetail(index) {
    const member = this.elements.teamMembers[index];
    if (!member || !this.elements.teamModal) return;
    
    const memberData = this.getTeamMemberData(member);
    this.populateTeamModal(memberData);
    this.openTeamModal();
    
    this.state.currentTeamMember = index;
  },
  
  /**
   * Get team member data
   */
  getTeamMemberData(member) {
    return {
      name: member.querySelector('[data-member-name]')?.textContent || '',
      position: member.querySelector('[data-member-position]')?.textContent || '',
      description: member.querySelector('[data-member-description]')?.textContent || '',
      image: member.querySelector('[data-member-image]')?.src || '',
      expertise: Array.from(member.querySelectorAll('[data-member-skill]')).map(skill => skill.textContent),
      email: member.dataset.memberEmail || '',
      linkedin: member.dataset.memberLinkedin || ''
    };
  },
  
  /**
   * Populate team modal
   */
  populateTeamModal(data) {
    if (!this.elements.teamModal) return;
    
    const nameEl = this.elements.teamModal.querySelector('[data-modal-name]');
    const positionEl = this.elements.teamModal.querySelector('[data-modal-position]');
    const descriptionEl = this.elements.teamModal.querySelector('[data-modal-description]');
    const imageEl = this.elements.teamModal.querySelector('[data-modal-image]');
    const expertiseEl = this.elements.teamModal.querySelector('[data-modal-expertise]');
    
    if (nameEl) nameEl.textContent = data.name;
    if (positionEl) positionEl.textContent = data.position;
    if (descriptionEl) descriptionEl.textContent = data.description;
    if (imageEl) imageEl.src = data.image;
    
    if (expertiseEl && data.expertise.length) {
      expertiseEl.innerHTML = data.expertise.map(skill => 
        `<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${skill}</span>`
      ).join('');
    }
  },
  
  /**
   * Open team modal
   */
  openTeamModal() {
    if (!this.elements.teamModal) return;
    
    this.elements.teamModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const closeButton = this.elements.teamModal.querySelector('[data-modal-close]');
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 300);
    }
  },
  
  /**
   * Close team modal
   */
  closeTeamModal() {
    if (!this.elements.teamModal) return;
    
    this.elements.teamModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to team member
    const currentMember = this.elements.teamMembers[this.state.currentTeamMember];
    if (currentMember) {
      currentMember.focus();
    }
  },
  
  /**
   * Initialize achievements animation
   */
  initAchievements() {
    if (!this.elements.achievementSection) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.state.achievementsAnimated) {
          this.animateAchievements();
          this.state.achievementsAnimated = true;
        }
      });
    }, {
      threshold: 0.5
    });
    
    observer.observe(this.elements.achievementSection);
  },
  
  /**
   * Animate achievements
   */
  animateAchievements() {
    this.elements.achievementNumbers.forEach((number, index) => {
      setTimeout(() => {
        this.animateAchievementNumber(number);
      }, index * 200);
    });
  },
  
  /**
   * Animate individual achievement number
   */
  animateAchievementNumber(element) {
    const targetText = element.textContent;
    const numberMatch = targetText.match(/\d+/);
    
    if (!numberMatch) return;
    
    const targetNumber = parseInt(numberMatch[0]);
    const prefix = targetText.substring(0, numberMatch.index);
    const suffix = targetText.substring(numberMatch.index + numberMatch[0].length);
    
    const duration = this.config.achievementCountDuration;
    const increment = targetNumber / (duration / 16);
    let current = 0;
    
    element.classList.add('animate-countUp');
    
    const updateNumber = () => {
      current += increment;
      if (current < targetNumber) {
        element.textContent = prefix + Math.floor(current) + suffix;
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = targetText;
      }
    };
    
    requestAnimationFrame(updateNumber);
  },
  
  /**
   * Initialize value cards
   */
  initValueCards() {
    this.elements.valueCards.forEach((card, index) => {
      // Add scroll animation
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
      
      observer.observe(card);
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.onValueCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.onValueCardHover(card, false);
      });
    });
  },
  
  /**
   * Handle value card hover
   */
  onValueCardHover(card, isHovering) {
    const icon = card.querySelector('[data-value-icon]');
    const background = card.querySelector('[data-value-background]');
    
    if (isHovering) {
      if (icon) icon.classList.add('animate-pulse', 'scale-110');
      if (background) background.classList.add('opacity-20');
    } else {
      if (icon) icon.classList.remove('animate-pulse', 'scale-110');
      if (background) background.classList.remove('opacity-20');
    }
  },
  
  /**
   * Initialize contact CTA
   */
  initContactCTA() {
    if (!this.elements.contactCTA) return;
    
    // Add scroll animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, {
      threshold: 0.3
    });
    
    observer.observe(this.elements.contactCTA);
    
    // Add button interactions
    const ctaButtons = this.elements.contactCTA.querySelectorAll('button, a');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'about_cta_click', {
            button_text: button.textContent.trim(),
            page_location: window.location.href
          });
        }
      });
    });
  },
  
  /**
   * Bind global events
   */
  bindEvents() {
    // Team modal close events
    if (this.elements.teamModal) {
      const closeButton = this.elements.teamModal.querySelector('[data-modal-close]');
      const overlay = this.elements.teamModal.querySelector('[data-modal-overlay]');
      
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.closeTeamModal();
        });
      }
      
      if (overlay) {
        overlay.addEventListener('click', () => {
          this.closeTeamModal();
        });
      }
      
      // ESC key to close modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.elements.teamModal.classList.contains('active')) {
          this.closeTeamModal();
        }
      });
    }
    
    // Smooth scroll for internal links
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
    
    // Vision/Mission section animations
    this.setupVisionMissionAnimations();
    
    // CEO message animation
    this.setupCEOMessageAnimation();
  },
  
  /**
   * Setup vision/mission animations
   */
  setupVisionMissionAnimations() {
    const sections = [this.elements.visionSection, this.elements.missionSection];
    
    sections.forEach((section, index) => {
      if (!section) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fadeInLeft');
            }, index * 300);
          }
        });
      }, {
        threshold: 0.3
      });
      
      observer.observe(section);
    });
  },
  
  /**
   * Setup CEO message animation
   */
  setupCEOMessageAnimation() {
    if (!this.elements.ceoMessage) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate quote
          const quote = entry.target.querySelector('[data-ceo-quote]');
          if (quote) {
            quote.classList.add('animate-fadeInUp');
          }
          
          // Animate signature with delay
          const signature = entry.target.querySelector('[data-ceo-signature]');
          if (signature) {
            setTimeout(() => {
              signature.classList.add('animate-fadeInRight');
            }, 500);
          }
        }
      });
    }, {
      threshold: 0.3
    });
    
    observer.observe(this.elements.ceoMessage);
  },
  
  /**
   * Analytics tracking
   */
  setupAnalytics() {
    // Track page view
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: 'About - Potensia Inc.',
        page_location: window.location.href
      });
    }
    
    // Track timeline interaction
    this.elements.timelineItems.forEach((item, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'timeline_view', {
                timeline_item: index,
                timeline_year: item.dataset.year || 'unknown'
              });
            }
          }
        });
      }, { threshold: 0.8 });
      
      observer.observe(item);
    });
    
    // Track team member clicks
    this.elements.teamMembers.forEach((member, index) => {
      member.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'team_member_click', {
            member_index: index,
            member_name: member.querySelector('[data-member-name]')?.textContent || 'unknown'
          });
        }
      });
    });
  },
  
  /**
   * Initialize CEO message typewriter effect
   */
  initTypewriterEffect() {
    const typewriterElement = document.querySelector('[data-typewriter]');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    const speed = 50; // milliseconds per character
    
    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '2px solid currentColor';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Add blinking cursor
        setInterval(() => {
          typewriterElement.style.borderRight = 
            typewriterElement.style.borderRight === '2px solid transparent' 
              ? '2px solid currentColor' 
              : '2px solid transparent';
        }, 500);
      }
    };
    
    // Start typewriter when element comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeWriter, 1000);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(typewriterElement);
  },
  
  /**
   * Initialize download brochure functionality
   */
  initBrochureDownload() {
    const downloadButtons = document.querySelectorAll('[data-download-brochure]');
    
    downloadButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = '다운로드 중...';
        
        try {
          // Track download attempt
          if (typeof gtag !== 'undefined') {
            gtag('event', 'brochure_download', {
              page_location: window.location.href
            });
          }
          
          // Simulate download (replace with actual file download)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create download link
          const link = document.createElement('a');
          link.href = '/assets/documents/potensia-brochure.pdf';
          link.download = 'Potensia-Company-Brochure.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          button.textContent = '다운로드 완료!';
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 2000);
          
        } catch (error) {
          console.error('Download failed:', error);
          button.textContent = '다운로드 실패';
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 2000);
        }
      });
    });
  },
  
  /**
   * Initialize parallax scrolling for background elements
   */
  initParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('[data-parallax-about]');
    
    if (parallaxElements.length === 0) return;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * (parseFloat(element.dataset.parallaxRate) || -0.5);
        element.style.transform = `translateY(${rate}px)`;
      });
    };
    
    window.addEventListener('scroll', POTENSIA.utils.throttle(updateParallax, 16));
  },
  
  /**
   * Initialize floating elements animation
   */
  initFloatingElements() {
    const floatingElements = document.querySelectorAll('[data-float-animation]');
    
    floatingElements.forEach((element, index) => {
      const delay = index * 1000; // Stagger the animations
      const duration = 4000 + (index * 500); // Vary duration
      
      element.style.animationDelay = `${delay}ms`;
      element.style.animationDuration = `${duration}ms`;
      element.classList.add('animate-float');
    });
  },
  
  /**
   * Initialize value cards interaction
   */
  initValueCardsInteraction() {
    this.elements.valueCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        // Remove active class from all cards
        this.elements.valueCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        card.classList.add('active');
        
        // Show detailed information
        this.showValueDetail(index);
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'value_card_click', {
            value_index: index,
            value_title: card.querySelector('[data-value-title]')?.textContent || 'unknown'
          });
        }
      });
    });
  },
  
  /**
   * Show value detail
   */
  showValueDetail(index) {
    const valueDetails = [
      {
        title: "혁신",
        description: "우리는 끊임없는 연구개발과 기술 혁신을 통해 업계를 선도합니다. 새로운 아이디어와 창의적 사고로 고객에게 차별화된 가치를 제공합니다.",
        examples: ["AI 기술 도입", "새로운 개발 방법론", "혁신적 UI/UX"]
      },
      {
        title: "신뢰",
        description: "투명한 소통과 정직한 관계를 바탕으로 고객과의 신뢰를 구축합니다. 약속한 것은 반드시 지키며, 고객의 성공을 위해 최선을 다합니다.",
        examples: ["투명한 프로젝트 진행", "정확한 일정 준수", "솔직한 커뮤니케이션"]
      },
      {
        title: "성장",
        description: "고객과 함께 성장하며 지속가능한 가치를 창출합니다. 시장 변화에 능동적으로 대응하고 새로운 기회를 창출합니다.",
        examples: ["지속적인 학습", "시장 확대", "새로운 기회 발굴"]
      },
      {
        title: "협력",
        description: "팀워크와 상호 존중을 바탕으로 최고의 결과를 만들어냅니다. 다양성을 인정하고 서로의 강점을 살려 시너지를 창출합니다.",
        examples: ["팀워크 강화", "지식 공유", "상호 협력"]
      }
    ];
    
    const detail = valueDetails[index];
    if (!detail) return;
    
    // Create or update detail panel
    let detailPanel = document.querySelector('[data-value-detail]');
    if (!detailPanel) {
      detailPanel = document.createElement('div');
      detailPanel.setAttribute('data-value-detail', '');
      detailPanel.className = 'mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100';
      
      const valueSection = document.querySelector('[data-values-section]');
      if (valueSection) {
        valueSection.appendChild(detailPanel);
      }
    }
    
    detailPanel.innerHTML = `
      <h3 class="text-2xl font-bold text-gray-900 mb-4">${detail.title}</h3>
      <p class="text-gray-600 mb-6 leading-relaxed">${detail.description}</p>
      <div class="space-y-2">
        <h4 class="font-semibold text-gray-900">실천 방안</h4>
        <ul class="space-y-1">
          ${detail.examples.map(example => `
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">${example}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    // Animate panel appearance
    detailPanel.classList.add('animate-fadeInUp');
  },
  
  /**
   * Performance optimizations
   */
  optimizePerformance() {
    // Preload team member images
    this.elements.teamMembers.forEach(member => {
      const img = member.querySelector('[data-member-image]');
      if (img && img.dataset.src) {
        const preloadImg = new Image();
        preloadImg.src = img.dataset.src;
      }
    });
    
    // Lazy load non-critical animations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.initParallaxScrolling();
        this.initFloatingElements();
        this.initTypewriterEffect();
      });
    } else {
      setTimeout(() => {
        this.initParallaxScrolling();
        this.initFloatingElements();
        this.initTypewriterEffect();
      }, 1000);
    }
  },
  
  /**
   * Accessibility enhancements
   */
  enhanceAccessibility() {
    // Add skip links for timeline
    const timelineSkip = document.createElement('a');
    timelineSkip.href = '#timeline-end';
    timelineSkip.textContent = 'Skip timeline';
    timelineSkip.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
    
    if (this.elements.timelineSection) {
      this.elements.timelineSection.insertBefore(timelineSkip, this.elements.timelineSection.firstChild);
    }
    
    // Add ARIA labels to interactive elements
    this.elements.teamMembers.forEach((member, index) => {
      member.setAttribute('role', 'button');
      member.setAttribute('tabindex', '0');
      member.setAttribute('aria-label', `View details for team member ${index + 1}`);
      
      // Keyboard navigation
      member.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showTeamMemberDetail(index);
        }
      });
    });
    
    // Enhanced focus management for timeline
    this.elements.timelineItems.forEach((item, index) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Timeline item ${index + 1}: ${item.dataset.year || 'Unknown year'}`);
    });
  },
  
  /**
   * Cleanup function
   */
  destroy() {
    // Remove event listeners
    this.elements.teamMembers.forEach(member => {
      member.removeEventListener('click', this.showTeamMemberDetail);
      member.removeEventListener('mouseenter', this.onTeamMemberHover);
      member.removeEventListener('mouseleave', this.onTeamMemberHover);
    });
    
    this.elements.valueCards.forEach(card => {
      card.removeEventListener('click', this.showValueDetail);
      card.removeEventListener('mouseenter', this.onValueCardHover);
      card.removeEventListener('mouseleave', this.onValueCardHover);
    });
    
    // Clear any intervals or timeouts
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    
    console.log('About page destroyed');
  }
};

/**
 * ==========================================================================
 * AUTO-INITIALIZATION
 * ==========================================================================
 */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    PotensiaAbout.init();
    PotensiaAbout.setupAnalytics();
    PotensiaAbout.initBrochureDownload();
    PotensiaAbout.initValueCardsInteraction();
    PotensiaAbout.optimizePerformance();
    PotensiaAbout.enhanceAccessibility();
  });
} else {
  PotensiaAbout.init();
  PotensiaAbout.setupAnalytics();
  PotensiaAbout.initBrochureDownload();
  PotensiaAbout.initValueCardsInteraction();
  PotensiaAbout.optimizePerformance();
  PotensiaAbout.enhanceAccessibility();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  PotensiaAbout.destroy();
});

// Export for global access
window.PotensiaAbout = PotensiaAbout;