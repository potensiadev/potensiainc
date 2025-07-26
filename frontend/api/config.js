/**
 * ==========================================================================
 * POTENSIA INC. - API CONFIGURATION
 * ==========================================================================
 */

'use strict';

/**
 * API Configuration for Potensia Website
 * Railway Backend Integration
 */
const ApiConfig = {
  // Environment Configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Base URLs
  baseUrl: {
    development: 'http://localhost:3000',
    staging: 'https://potensia-staging.railway.app',
    production: 'https://potensia-api.railway.app'
  },
  
  // Get current base URL
  getBaseUrl() {
    return this.baseUrl[this.environment] || this.baseUrl.development;
  },
  
  // API Version
  version: 'v1',
  
  // Full API URL
  getApiUrl() {
    return `${this.getBaseUrl()}/api/${this.version}`;
  },
  
  // Request Configuration
  request: {
    timeout: 10000, // 10 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client': 'potensia-web',
      'X-Version': '1.0.0'
    }
  },
  
  // Authentication (if needed)
  auth: {
    tokenKey: 'potensia_token',
    refreshTokenKey: 'potensia_refresh_token',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Rate Limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    retryAfter: 5000 // 5 seconds
  },
  
  // Cache Configuration
  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Max cached items
    strategies: {
      news: 2 * 60 * 1000, // 2 minutes
      team: 10 * 60 * 1000, // 10 minutes
      company: 30 * 60 * 1000, // 30 minutes
      static: 60 * 60 * 1000 // 1 hour
    }
  },
  
  // Error Codes
  errorCodes: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  },
  
  // Success Codes
  successCodes: [200, 201, 202, 204],
  
  // Client Error Codes
  clientErrorCodes: [400, 401, 403, 404, 422, 429],
  
  // Server Error Codes
  serverErrorCodes: [500, 501, 502, 503, 504],
  
  // Feature Flags
  features: {
    analytics: true,
    errorReporting: true,
    performanceMonitoring: true,
    offlineMode: false,
    backgroundSync: false,
    pushNotifications: false
  },
  
  // External Services
  external: {
    analytics: {
      googleAnalytics: {
        trackingId: process.env.GA_TRACKING_ID || 'GA_MEASUREMENT_ID',
        enabled: true
      },
      hotjar: {
        siteId: process.env.HOTJAR_SITE_ID,
        enabled: false
      }
    },
    
    cdn: {
      images: 'https://cdn.potensiainc.com/images',
      documents: 'https://cdn.potensiainc.com/documents',
      videos: 'https://cdn.potensiainc.com/videos'
    },
    
    email: {
      service: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: 'noreply@potensiainc.com',
      replyToEmail: 'contact@potensiainc.com'
    },
    
    captcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY,
      enabled: true,
      version: 'v3',
      threshold: 0.5
    }
  },
  
  // Validation Rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[0-9\s\-\(\)]{10,}$/,
    url: /^https?:\/\/[^\s$.?#].[^\s]*$/,
    
    limits: {
      nameMin: 2,
      nameMax: 50,
      messageMin: 10,
      messageMax: 1000,
      subjectMax: 100,
      fileSize: 5 * 1024 * 1024, // 5MB
      filesCount: 5
    }
  },
  
  // Monitoring and Logging
  monitoring: {
    errorReporting: {
      enabled: true,
      endpoint: '/api/v1/errors',
      includeUserAgent: true,
      includeUrl: true,
      includeStackTrace: this.environment === 'development'
    },
    
    performance: {
      enabled: true,
      endpoint: '/api/v1/performance',
      sampleRate: 0.1, // 10% of requests
      thresholds: {
        slow: 2000, // 2 seconds
        veryslow: 5000 // 5 seconds
      }
    },
    
    analytics: {
      enabled: true,
      endpoint: '/api/v1/analytics',
      events: [
        'page_view',
        'button_click',
        'form_submit',
        'file_download',
        'video_play',
        'scroll_depth',
        'time_on_page'
      ]
    }
  },
  
  // Security Configuration
  security: {
    csrfProtection: true,
    xssProtection: true,
    contentTypeValidation: true,
    rateLimitByIP: true,
    
    allowedOrigins: [
      'https://potensiainc.com',
      'https://www.potensiainc.com',
      'https://potensiainc.netlify.app'
    ],
    
    blockedUserAgents: [
      'bot',
      'crawler',
      'spider'
    ]
  },
  
  // Development Configuration
  development: {
    debugMode: this.environment === 'development',
    mockApi: false,
    logLevel: 'debug',
    showNetworkLogs: true,
    enableHotReload: true
  },
  
  // Production Configuration
  production: {
    compression: true,
    minification: true,
    bundleAnalyzer: false,
    sourceMap: false,
    logLevel: 'error'
  }
};

/**
 * ==========================================================================
 * CONFIGURATION METHODS
 * ==========================================================================
 */

/**
 * Get configuration value by path
 */
ApiConfig.get = function(path, defaultValue = null) {
  const keys = path.split('.');
  let current = this;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current;
};

/**
 * Set configuration value by path
 */
ApiConfig.set = function(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = this;
  
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

/**
 * Check if feature is enabled
 */
ApiConfig.isFeatureEnabled = function(featureName) {
  return this.get(`features.${featureName}`, false);
};

/**
 * Get external service configuration
 */
ApiConfig.getExternalService = function(serviceName) {
  return this.get(`external.${serviceName}`, {});
};

/**
 * Get validation rule
 */
ApiConfig.getValidationRule = function(ruleName) {
  return this.get(`validation.${ruleName}`);
};

/**
 * Check if environment is development
 */
ApiConfig.isDevelopment = function() {
  return this.environment === 'development';
};

/**
 * Check if environment is production
 */
ApiConfig.isProduction = function() {
  return this.environment === 'production';
};

/**
 * Get error message for code
 */
ApiConfig.getErrorMessage = function(errorCode) {
  const messages = {
    [this.errorCodes.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
    [this.errorCodes.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    [this.errorCodes.RATE_LIMIT_ERROR]: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.',
    [this.errorCodes.VALIDATION_ERROR]: '입력된 정보를 확인해주세요.',
    [this.errorCodes.AUTH_ERROR]: '인증이 필요합니다.',
    [this.errorCodes.SERVER_ERROR]: '서버 오류가 발생했습니다. 관리자에게 문의해주세요.',
    [this.errorCodes.NOT_FOUND]: '요청하신 정보를 찾을 수 없습니다.',
    [this.errorCodes.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.'
  };
  
  return messages[errorCode] || messages[this.errorCodes.UNKNOWN_ERROR];
};

/**
 * Initialize configuration
 */
ApiConfig.init = function() {
  // Set environment-specific configurations
  if (this.isDevelopment()) {
    this.set('request.timeout', 30000); // Longer timeout for development
    this.set('cache.enabled', false); // Disable cache in development
  }
  
  // Override with environment variables if available
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_BASE_URL) {
      this.baseUrl[this.environment] = process.env.API_BASE_URL;
    }
    
    if (process.env.API_TIMEOUT) {
      this.set('request.timeout', parseInt(process.env.API_TIMEOUT));
    }
    
    if (process.env.CACHE_ENABLED) {
      this.set('cache.enabled', process.env.CACHE_ENABLED === 'true');
    }
  }
  
  // Log configuration in development
  if (this.isDevelopment() && this.get('development.debugMode')) {
    console.log('API Configuration initialized:', {
      environment: this.environment,
      baseUrl: this.getBaseUrl(),
      apiUrl: this.getApiUrl(),
      features: this.features
    });
  }
};

/**
 * ==========================================================================
 * BROWSER COMPATIBILITY
 * ==========================================================================
 */

// Initialize configuration
ApiConfig.init();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js/CommonJS
  module.exports = ApiConfig;
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], function() {
    return ApiConfig;
  });
} else {
  // Browser global
  window.ApiConfig = ApiConfig;
}