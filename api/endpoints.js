/**
 * ==========================================================================
 * POTENSIA INC. - API ENDPOINTS
 * ==========================================================================
 */

'use strict';

/**
 * API Endpoints Configuration
 * Centralized endpoint management for Railway backend
 */
const ApiEndpoints = {
  /**
   * Base endpoint configuration
   */
  base: {
    prefix: '/api/v1',
    timeout: 10000,
    retries: 3
  },

  /**
   * ==========================================================================
   * CONTACT & COMMUNICATION ENDPOINTS
   * ==========================================================================
   */
  contact: {
    // General contact form submission
    submit: {
      method: 'POST',
      path: '/contact',
      description: 'Submit contact form',
      validation: {
        required: ['name', 'email', 'message'],
        fields: {
          name: { type: 'string', min: 2, max: 50 },
          email: { type: 'email' },
          phone: { type: 'phone', optional: true },
          company: { type: 'string', max: 100, optional: true },
          subject: { type: 'string', max: 100, optional: true },
          message: { type: 'string', min: 10, max: 1000 },
          service: { type: 'string', optional: true },
          budget: { type: 'string', optional: true }
        }
      },
      rateLimit: {
        maxRequests: 5,
        windowMs: 60000 // 1 minute
      }
    },

    // Newsletter subscription
    newsletter: {
      method: 'POST',
      path: '/contact/newsletter',
      description: 'Subscribe to newsletter',
      validation: {
        required: ['email'],
        fields: {
          email: { type: 'email' },
          name: { type: 'string', max: 50, optional: true },
          preferences: { type: 'array', optional: true }
        }
      },
      rateLimit: {
        maxRequests: 3,
        windowMs: 60000
      }
    },

    // Contact information retrieval
    info: {
      method: 'GET',
      path: '/contact/info',
      description: 'Get contact information',
      cache: {
        ttl: 30 * 60 * 1000 // 30 minutes
      }
    },

    // Consultation request
    consultation: {
      method: 'POST',
      path: '/contact/consultation',
      description: 'Request consultation',
      validation: {
        required: ['name', 'email', 'service', 'timeframe'],
        fields: {
          name: { type: 'string', min: 2, max: 50 },
          email: { type: 'email' },
          phone: { type: 'phone', optional: true },
          company: { type: 'string', max: 100 },
          service: { type: 'string', enum: ['software', 'marketing', 'consulting', 'content'] },
          timeframe: { type: 'string', enum: ['immediate', '1-month', '3-months', '6-months'] },
          budget: { type: 'string', optional: true },
          description: { type: 'string', min: 20, max: 500 }
        }
      }
    }
  },

  /**
   * ==========================================================================
   * NEWS & CONTENT ENDPOINTS
   * ==========================================================================
   */
  news: {
    // Get all news articles
    list: {
      method: 'GET',
      path: '/news',
      description: 'Get news articles list',
      params: {
        page: { type: 'number', default: 1, min: 1 },
        limit: { type: 'number', default: 10, min: 1, max: 50 },
        category: { type: 'string', optional: true },
        search: { type: 'string', optional: true },
        sort: { type: 'string', enum: ['date', 'views', 'title'], default: 'date' },
        order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
      },
      cache: {
        ttl: 2 * 60 * 1000 // 2 minutes
      }
    },

    // Get latest news
    latest: {
      method: 'GET',
      path: '/news/latest',
      description: 'Get latest news articles',
      params: {
        limit: { type: 'number', default: 5, max: 10 }
      },
      cache: {
        ttl: 1 * 60 * 1000 // 1 minute
      }
    },

    // Get featured news
    featured: {
      method: 'GET',
      path: '/news/featured',
      description: 'Get featured news articles',
      cache: {
        ttl: 5 * 60 * 1000 // 5 minutes
      }
    },

    // Get single news article
    detail: {
      method: 'GET',
      path: '/news/:id',
      description: 'Get news article by ID',
      params: {
        id: { type: 'string', required: true }
      },
      cache: {
        ttl: 10 * 60 * 1000 // 10 minutes
      }
    },

    // Get news categories
    categories: {
      method: 'GET',
      path: '/news/categories',
      description: 'Get news categories',
      cache: {
        ttl: 30 * 60 * 1000 // 30 minutes
      }
    },

    // Get related news
    related: {
      method: 'GET',
      path: '/news/:id/related',
      description: 'Get related news articles',
      params: {
        id: { type: 'string', required: true },
        limit: { type: 'number', default: 3, max: 5 }
      },
      cache: {
        ttl: 5 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * COMPANY & TEAM ENDPOINTS
   * ==========================================================================
   */
  company: {
    // Get company information
    info: {
      method: 'GET',
      path: '/company/info',
      description: 'Get company information',
      cache: {
        ttl: 60 * 60 * 1000 // 1 hour
      }
    },

    // Get team members
    team: {
      method: 'GET',
      path: '/company/team',
      description: 'Get team members',
      cache: {
        ttl: 30 * 60 * 1000 // 30 minutes
      }
    },

    // Get single team member
    teamMember: {
      method: 'GET',
      path: '/company/team/:id',
      description: 'Get team member by ID',
      params: {
        id: { type: 'string', required: true }
      },
      cache: {
        ttl: 30 * 60 * 1000
      }
    },

    // Get company timeline/history
    timeline: {
      method: 'GET',
      path: '/company/timeline',
      description: 'Get company timeline',
      cache: {
        ttl: 60 * 60 * 1000 // 1 hour
      }
    },

    // Get company statistics
    stats: {
      method: 'GET',
      path: '/company/stats',
      description: 'Get company statistics',
      cache: {
        ttl: 10 * 60 * 1000 // 10 minutes
      }
    },

    // Get company values
    values: {
      method: 'GET',
      path: '/company/values',
      description: 'Get company core values',
      cache: {
        ttl: 60 * 60 * 1000
      }
    },

    // Get achievements
    achievements: {
      method: 'GET',
      path: '/company/achievements',
      description: 'Get company achievements',
      cache: {
        ttl: 30 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * SERVICES & BUSINESS ENDPOINTS
   * ==========================================================================
   */
  services: {
    // Get all services
    list: {
      method: 'GET',
      path: '/services',
      description: 'Get services list',
      cache: {
        ttl: 30 * 60 * 1000
      }
    },

    // Get service categories
    categories: {
      method: 'GET',
      path: '/services/categories',
      description: 'Get service categories',
      cache: {
        ttl: 60 * 60 * 1000
      }
    },

    // Get single service
    detail: {
      method: 'GET',
      path: '/services/:id',
      description: 'Get service by ID',
      params: {
        id: { type: 'string', required: true }
      },
      cache: {
        ttl: 30 * 60 * 1000
      }
    },

    // Get service features
    features: {
      method: 'GET',
      path: '/services/:id/features',
      description: 'Get service features',
      params: {
        id: { type: 'string', required: true }
      },
      cache: {
        ttl: 30 * 60 * 1000
      }
    },

    // Service inquiry
    inquiry: {
      method: 'POST',
      path: '/services/inquiry',
      description: 'Submit service inquiry',
      validation: {
        required: ['name', 'email', 'service', 'message'],
        fields: {
          name: { type: 'string', min: 2, max: 50 },
          email: { type: 'email' },
          phone: { type: 'phone', optional: true },
          company: { type: 'string', max: 100, optional: true },
          service: { type: 'string' },
          budget: { type: 'string', optional: true },
          timeline: { type: 'string', optional: true },
          message: { type: 'string', min: 20, max: 1000 }
        }
      }
    }
  },

  /**
   * ==========================================================================
   * PORTFOLIO & CASE STUDIES ENDPOINTS
   * ==========================================================================
   */
  portfolio: {
    // Get portfolio items
    list: {
      method: 'GET',
      path: '/portfolio',
      description: 'Get portfolio items',
      params: {
        category: { type: 'string', optional: true },
        featured: { type: 'boolean', optional: true },
        limit: { type: 'number', default: 12, max: 50 }
      },
      cache: {
        ttl: 15 * 60 * 1000 // 15 minutes
      }
    },

    // Get portfolio item detail
    detail: {
      method: 'GET',
      path: '/portfolio/:id',
      description: 'Get portfolio item by ID',
      params: {
        id: { type: 'string', required: true }
      },
      cache: {
        ttl: 30 * 60 * 1000
      }
    },

    // Get case studies
    caseStudies: {
      method: 'GET',
      path: '/portfolio/case-studies',
      description: 'Get case studies',
      cache: {
        ttl: 30 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * FILE & MEDIA ENDPOINTS
   * ==========================================================================
   */
  files: {
    // Upload file
    upload: {
      method: 'POST',
      path: '/files/upload',
      description: 'Upload file',
      contentType: 'multipart/form-data',
      validation: {
        files: {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'],
          maxCount: 5
        }
      },
      rateLimit: {
        maxRequests: 10,
        windowMs: 60000
      }
    },

    // Get file info
    info: {
      method: 'GET',
      path: '/files/:id',
      description: 'Get file information',
      params: {
        id: { type: 'string', required: true }
      }
    },

    // Download file
    download: {
      method: 'GET',
      path: '/files/:id/download',
      description: 'Download file',
      params: {
        id: { type: 'string', required: true }
      }
    },

    // Get company brochure
    brochure: {
      method: 'GET',
      path: '/files/brochure',
      description: 'Download company brochure',
      responseType: 'blob'
    }
  },

  /**
   * ==========================================================================
   * SEARCH ENDPOINTS
   * ==========================================================================
   */
  search: {
    // Global search
    global: {
      method: 'GET',
      path: '/search',
      description: 'Global search across all content',
      params: {
        q: { type: 'string', required: true, min: 2 },
        type: { type: 'string', enum: ['all', 'news', 'services', 'portfolio'], default: 'all' },
        limit: { type: 'number', default: 10, max: 50 }
      },
      cache: {
        ttl: 5 * 60 * 1000
      }
    },

    // Search suggestions
    suggestions: {
      method: 'GET',
      path: '/search/suggestions',
      description: 'Get search suggestions',
      params: {
        q: { type: 'string', required: true, min: 1 },
        limit: { type: 'number', default: 5, max: 10 }
      },
      cache: {
        ttl: 10 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * ANALYTICS & TRACKING ENDPOINTS
   * ==========================================================================
   */
  analytics: {
    // Track page view
    pageView: {
      method: 'POST',
      path: '/analytics/pageview',
      description: 'Track page view',
      validation: {
        required: ['page', 'timestamp'],
        fields: {
          page: { type: 'string' },
          title: { type: 'string', optional: true },
          referrer: { type: 'string', optional: true },
          timestamp: { type: 'number' },
          userAgent: { type: 'string', optional: true },
          sessionId: { type: 'string', optional: true }
        }
      },
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },

    // Track event
    event: {
      method: 'POST',
      path: '/analytics/event',
      description: 'Track custom event',
      validation: {
        required: ['event', 'timestamp'],
        fields: {
          event: { type: 'string' },
          category: { type: 'string', optional: true },
          label: { type: 'string', optional: true },
          value: { type: 'number', optional: true },
          timestamp: { type: 'number' },
          page: { type: 'string', optional: true },
          sessionId: { type: 'string', optional: true }
        }
      },
      rateLimit: {
        maxRequests: 200,
        windowMs: 60000
      }
    },

    // Get analytics summary
    summary: {
      method: 'GET',
      path: '/analytics/summary',
      description: 'Get analytics summary',
      params: {
        period: { type: 'string', enum: ['day', 'week', 'month'], default: 'week' }
      },
      auth: true,
      cache: {
        ttl: 60 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * HEALTH & STATUS ENDPOINTS
   * ==========================================================================
   */
  health: {
    // Health check
    check: {
      method: 'GET',
      path: '/health',
      description: 'Health check endpoint',
      timeout: 5000
    },

    // Detailed status
    status: {
      method: 'GET',
      path: '/health/status',
      description: 'Detailed system status',
      timeout: 10000
    },

    // Version information
    version: {
      method: 'GET',
      path: '/health/version',
      description: 'API version information',
      cache: {
        ttl: 60 * 60 * 1000
      }
    }
  },

  /**
   * ==========================================================================
   * ERROR REPORTING ENDPOINTS
   * ==========================================================================
   */
  errors: {
    // Report client error
    report: {
      method: 'POST',
      path: '/errors/report',
      description: 'Report client-side error',
      validation: {
        required: ['message', 'timestamp'],
        fields: {
          message: { type: 'string' },
          stack: { type: 'string', optional: true },
          url: { type: 'string', optional: true },
          userAgent: { type: 'string', optional: true },
          timestamp: { type: 'number' },
          level: { type: 'string', enum: ['error', 'warning', 'info'], default: 'error' }
        }
      },
      rateLimit: {
        maxRequests: 50,
        windowMs: 60000
      }
    }
  }
};

/**
 * ==========================================================================
 * ENDPOINT UTILITIES
 * ==========================================================================
 */

/**
 * Build full URL for endpoint
 */
ApiEndpoints.buildUrl = function(category, endpoint, params = {}) {
  const config = this.getEndpoint(category, endpoint);
  if (!config) return null;
  
  let path = config.path;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  
  return `${this.base.prefix}${path}`;
};

/**
 * Get endpoint configuration
 */
ApiEndpoints.getEndpoint = function(category, endpoint) {
  return this[category] && this[category][endpoint] ? this[category][endpoint] : null;
};

/**
 * Get all endpoints for a category
 */
ApiEndpoints.getCategory = function(category) {
  return this[category] || {};
};

/**
 * Validate endpoint parameters
 */
ApiEndpoints.validateParams = function(category, endpoint, params = {}) {
  const config = this.getEndpoint(category, endpoint);
  if (!config || !config.params) return { valid: true };
  
  const errors = [];
  const validated = {};
  
  // Check required parameters
  Object.keys(config.params).forEach(key => {
    const paramConfig = config.params[key];
    const value = params[key];
    
    if (paramConfig.required && (value === undefined || value === null)) {
      errors.push(`Parameter '${key}' is required`);
      return;
    }
    
    if (value !== undefined) {
      // Type validation
      if (paramConfig.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`Parameter '${key}' must be a number`);
          return;
        }
        validated[key] = num;
      } else if (paramConfig.type === 'boolean') {
        validated[key] = Boolean(value);
      } else {
        validated[key] = String(value);
      }
      
      // Range validation
      if (paramConfig.min !== undefined && validated[key] < paramConfig.min) {
        errors.push(`Parameter '${key}' must be at least ${paramConfig.min}`);
      }
      
      if (paramConfig.max !== undefined && validated[key] > paramConfig.max) {
        errors.push(`Parameter '${key}' must be at most ${paramConfig.max}`);
      }
      
      // Enum validation
      if (paramConfig.enum && !paramConfig.enum.includes(validated[key])) {
        errors.push(`Parameter '${key}' must be one of: ${paramConfig.enum.join(', ')}`);
      }
    } else if (paramConfig.default !== undefined) {
      validated[key] = paramConfig.default;
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    params: validated
  };
};

/**
 * Get endpoint cache configuration
 */
ApiEndpoints.getCacheConfig = function(category, endpoint) {
  const config = this.getEndpoint(category, endpoint);
  return config && config.cache ? config.cache : null;
};

/**
 * Get endpoint rate limit configuration
 */
ApiEndpoints.getRateLimitConfig = function(category, endpoint) {
  const config = this.getEndpoint(category, endpoint);
  return config && config.rateLimit ? config.rateLimit : null;
};

/**
 * Check if endpoint requires authentication
 */
ApiEndpoints.requiresAuth = function(category, endpoint) {
  const config = this.getEndpoint(category, endpoint);
  return config && config.auth === true;
};

/**
 * Get all available endpoints
 */
ApiEndpoints.getAllEndpoints = function() {
  const endpoints = {};
  
  Object.keys(this).forEach(category => {
    if (typeof this[category] === 'object' && category !== 'base') {
      endpoints[category] = Object.keys(this[category]);
    }
  });
  
  return endpoints;
};

/**
 * ==========================================================================
 * EXPORT CONFIGURATION
 * ==========================================================================
 */

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiEndpoints;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return ApiEndpoints;
  });
} else {
  window.ApiEndpoints = ApiEndpoints;
}