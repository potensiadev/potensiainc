/**
 * ==========================================================================
 * POTENSIA INC. - API UTILITIES
 * ==========================================================================
 */

'use strict';

/**
 * API Utilities for Railway Backend Integration
 * Comprehensive set of utilities for API communication
 */
const ApiUtils = {
  /**
   * ==========================================================================
   * HTTP CLIENT
   * ==========================================================================
   */
  
  /**
   * Enhanced fetch wrapper with retry logic and error handling
   */
  async request(url, options = {}) {
    const config = this.getConfig();
    const fullUrl = this.buildFullUrl(url);
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.request.headers,
        ...options.headers
      },
      timeout: config.request.timeout,
      ...options
    };
    
    // Add authentication if available
    const token = this.getAuthToken();
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      defaultOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    
    let lastError;
    
    for (let attempt = 0; attempt <= config.request.retries; attempt++) {
      try {
        // Check rate limiting
        if (this.isRateLimited(url)) {
          throw new Error('RATE_LIMITED');
        }
        
        // Perform request
        const response = await this.fetchWithTimeout(fullUrl, defaultOptions);
        
        // Update rate limiting
        this.updateRateLimit(url);
        
        // Handle response
        return await this.handleResponse(response);
        
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error) || attempt === config.request.retries) {
          break;
        }
        
        // Wait before retry
        await this.sleep(config.request.retryDelay * Math.pow(2, attempt));
      }
    }
    
    throw this.createApiError(lastError, url);
  },
  
  /**
   * Fetch with timeout support
   */
  async fetchWithTimeout(url, options) {
    const timeout = options.timeout || 10000;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },
  
  /**
   * Handle response processing
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    // Handle different response types
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType && contentType.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }
    
    if (!response.ok) {
      throw this.createHttpError(response, data);
    }
    
    // Track successful response
    this.trackPerformance(response);
    
    return {
      data,
      status: response.status,
      headers: response.headers,
      ok: response.ok
    };
  },
  
  /**
   * ==========================================================================
   * CONVENIENCE METHODS
   * ==========================================================================
   */
  
  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    const url = this.buildUrlWithParams(endpoint, params);
    
    // Check cache first
    const cacheKey = this.getCacheKey('GET', url, params);
    const cachedData = this.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    const response = await this.request(url, {
      method: 'GET',
      ...options
    });
    
    // Cache successful response
    this.setCache(cacheKey, response);
    
    return response;
  },
  
  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const body = this.prepareRequestBody(data, options.contentType);
    
    return await this.request(endpoint, {
      method: 'POST',
      body,
      ...options
    });
  },
  
  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const body = this.prepareRequestBody(data, options.contentType);
    
    return await this.request(endpoint, {
      method: 'PUT',
      body,
      ...options
    });
  },
  
  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    const body = this.prepareRequestBody(data, options.contentType);
    
    return await this.request(endpoint, {
      method: 'PATCH',
      body,
      ...options
    });
  },
  
  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return await this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  },
  
  /**
   * ==========================================================================
   * SPECIALIZED API METHODS
   * ==========================================================================
   */
  
  /**
   * Contact form submission
   */
  async submitContactForm(formData) {
    const validationResult = this.validateContactForm(formData);
    if (!validationResult.valid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    return await this.post('/contact', formData);
  },
  
  /**
   * Newsletter subscription
   */
  async subscribeNewsletter(email, preferences = {}) {
    const data = { email, ...preferences };
    
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    
    return await this.post('/contact/newsletter', data);
  },
  
  /**
   * Get news articles
   */
  async getNews(options = {}) {
    const params = {
      page: options.page || 1,
      limit: options.limit || 10,
      category: options.category,
      search: options.search,
      sort: options.sort || 'date',
      order: options.order || 'desc'
    };
    
    return await this.get('/news', params);
  },
  
  /**
   * Get latest news
   */
  async getLatestNews(limit = 5) {
    return await this.get('/news/latest', { limit });
  },
  
  /**
   * Get company information
   */
  async getCompanyInfo() {
    return await this.get('/company/info');
  },
  
  /**
   * Get team members
   */
  async getTeamMembers() {
    return await this.get('/company/team');
  },
  
  /**
   * Get services
   */
  async getServices() {
    return await this.get('/services');
  },
  
  /**
   * Submit service inquiry
   */
  async submitServiceInquiry(inquiryData) {
    const validationResult = this.validateServiceInquiry(inquiryData);
    if (!validationResult.valid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    return await this.post('/services/inquiry', inquiryData);
  },
  
  /**
   * Upload file
   */
  async uploadFile(file, options = {}) {
    if (!this.validateFile(file)) {
      throw new Error('Invalid file');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
    
    return await this.post('/files/upload', formData, {
      contentType: 'multipart/form-data'
    });
  },
  
  /**
   * Download company brochure
   */
  async downloadBrochure() {
    const response = await this.get('/files/brochure');
    
    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Potensia-Company-Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },
  
  /**
   * Track page view
   */
  async trackPageView(page, title, additionalData = {}) {
    const data = {
      page,
      title,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
      ...additionalData
    };
    
    return await this.post('/analytics/pageview', data);
  },
  
  /**
   * Track custom event
   */
  async trackEvent(event, category, label, value, additionalData = {}) {
    const data = {
      event,
      category,
      label,
      value,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.getSessionId(),
      ...additionalData
    };
    
    return await this.post('/analytics/event', data);
  },
  
  /**
   * ==========================================================================
   * VALIDATION METHODS
   * ==========================================================================
   */
  
  /**
   * Validate contact form data
   */
  validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }
    
    if (!data.message || data.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Validate service inquiry data
   */
  validateServiceInquiry(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!this.isValidEmail(data.email)) {
      errors.push('Valid email is required');
    }
    
    if (!data.service) {
      errors.push('Service selection is required');
    }
    
    if (!data.message || data.message.length < 20) {
      errors.push('Message must be at least 20 characters');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Validate file upload
   */
  validateFile(file) {
    const config = this.getConfig();
    const maxSize = config.validation.limits.fileSize;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (file.size > maxSize) {
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Email validation
   */
  isValidEmail(email) {
    const config = this.getConfig();
    return config.validation.email.test(email);
  },
  
  /**
   * Phone validation
   */
  isValidPhone(phone) {
    const config = this.getConfig();
    return config.validation.phone.test(phone);
  },
  
  /**
   * ==========================================================================
   * CACHE MANAGEMENT
   * ==========================================================================
   */
  
  cache: new Map(),
  
  /**
   * Get cache key
   */
  getCacheKey(method, url, params) {
    return `${method}:${url}:${JSON.stringify(params)}`;
  },
  
  /**
   * Get from cache
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  /**
   * Set cache
   */
  setCache(key, data, ttl) {
    const config = this.getConfig();
    
    if (!config.cache.enabled) return;
    
    const expiry = Date.now() + (ttl || config.cache.defaultTTL);
    
    this.cache.set(key, {
      data,
      expiry
    });
    
    // Clean up old entries
    if (this.cache.size > config.cache.maxSize) {
      this.cleanupCache();
    }
  },
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  },
  
  /**
   * Cleanup old cache entries
   */
  cleanupCache() {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    }
  },
  
  /**
   * ==========================================================================
   * RATE LIMITING
   * ==========================================================================
   */
  
  rateLimitStore: new Map(),
  
  /**
   * Check if rate limited
   */
  isRateLimited(url) {
    const config = this.getConfig();
    const key = this.getRateLimitKey(url);
    const limit = this.rateLimitStore.get(key);
    
    if (!limit) return false;
    
    const now = Date.now();
    
    if (now > limit.resetTime) {
      this.rateLimitStore.delete(key);
      return false;
    }
    
    return limit.count >= config.rateLimit.maxRequests;
  },
  
  /**
   * Update rate limit counter
   */
  updateRateLimit(url) {
    const config = this.getConfig();
    const key = this.getRateLimitKey(url);
    const now = Date.now();
    
    let limit = this.rateLimitStore.get(key);
    
    if (!limit || now > limit.resetTime) {
      limit = {
        count: 0,
        resetTime: now + config.rateLimit.windowMs
      };
    }
    
    limit.count++;
    this.rateLimitStore.set(key, limit);
  },
  
  /**
   * Get rate limit key
   */
  getRateLimitKey(url) {
    return `rate_limit:${url}`;
  },
  
  /**
   * ==========================================================================
   * AUTHENTICATION
   * ==========================================================================
   */
  
  /**
   * Get authentication token
   */
  getAuthToken() {
    const config = this.getConfig();
    return localStorage.getItem(config.auth.tokenKey);
  },
  
  /**
   * Set authentication token
   */
  setAuthToken(token, refreshToken) {
    const config = this.getConfig();
    localStorage.setItem(config.auth.tokenKey, token);
    
    if (refreshToken) {
      localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
    }
  },
  
  /**
   * Remove authentication token
   */
  removeAuthToken() {
    const config = this.getConfig();
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
  },
  
  /**
   * Get CSRF token
   */
  getCSRFToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
  },
  
  /**
   * ==========================================================================
   * UTILITY METHODS
   * ==========================================================================
   */
  
  /**
   * Get configuration
   */
  getConfig() {
    return window.ApiConfig || {};
  },
  
  /**
   * Build full URL
   */
  buildFullUrl(endpoint) {
    const config = this.getConfig();
    const baseUrl = config.getApiUrl ? config.getApiUrl() : '/api/v1';
    
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    
    return `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  },
  
  /**
   * Build URL with query parameters
   */
  buildUrlWithParams(endpoint, params) {
    const url = new URL(this.buildFullUrl(endpoint), window.location.origin);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return url.toString();
  },
  
  /**
   * Prepare request body
   */
  prepareRequestBody(data, contentType) {
    if (contentType === 'multipart/form-data') {
      return data; // FormData object
    }
    
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }
    
    return data;
  },
  
  /**
   * Create API error
   */
  createApiError(error, url) {
    const config = this.getConfig();
    
    if (error.name === 'AbortError') {
      return {
        code: config.errorCodes.TIMEOUT_ERROR,
        message: config.getErrorMessage(config.errorCodes.TIMEOUT_ERROR),
        url,
        timestamp: Date.now()
      };
    }
    
    if (error.message === 'RATE_LIMITED') {
      return {
        code: config.errorCodes.RATE_LIMIT_ERROR,
        message: config.getErrorMessage(config.errorCodes.RATE_LIMIT_ERROR),
        url,
        timestamp: Date.now()
      };
    }
    
    if (!navigator.onLine) {
      return {
        code: config.errorCodes.NETWORK_ERROR,
        message: config.getErrorMessage(config.errorCodes.NETWORK_ERROR),
        url,
        timestamp: Date.now()
      };
    }
    
    return {
      code: config.errorCodes.UNKNOWN_ERROR,
      message: error.message || config.getErrorMessage(config.errorCodes.UNKNOWN_ERROR),
      url,
      timestamp: Date.now(),
      originalError: error
    };
  },
  
  /**
   * Create HTTP error
   */
  createHttpError(response, data) {
    const config = this.getConfig();
    let code;
    
    if (response.status >= 400 && response.status < 500) {
      if (response.status === 401) {
        code = config.errorCodes.AUTH_ERROR;
      } else if (response.status === 404) {
        code = config.errorCodes.NOT_FOUND;
      } else if (response.status === 422) {
        code = config.errorCodes.VALIDATION_ERROR;
      } else if (response.status === 429) {
        code = config.errorCodes.RATE_LIMIT_ERROR;
      } else {
        code = config.errorCodes.VALIDATION_ERROR;
      }
    } else if (response.status >= 500) {
      code = config.errorCodes.SERVER_ERROR;
    } else {
      code = config.errorCodes.UNKNOWN_ERROR;
    }
    
    return {
      code,
      message: data.message || config.getErrorMessage(code),
      status: response.status,
      data,
      timestamp: Date.now()
    };
  },
  
  /**
   * Check if should not retry
   */
  shouldNotRetry(error) {
    if (error.message === 'RATE_LIMITED') return true;
    if (error.name === 'AbortError') return true;
    if (error.status >= 400 && error.status < 500) return true;
    
    return false;
  },
  
  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('potensia_session_id');
    
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem('potensia_session_id', sessionId);
    }
    
    return sessionId;
  },
  
  /**
   * Generate UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  /**
   * Track performance
   */
  trackPerformance(response) {
    const config = this.getConfig();
    
    if (!config.monitoring.performance.enabled) return;
    
    const performanceEntry = {
      url: response.url,
      method: response.method,
      status: response.status,
      timestamp: Date.now(),
      responseTime: response.responseTime
    };
    
    // Send to analytics if slow
    if (response.responseTime > config.monitoring.performance.thresholds.slow) {
      this.reportPerformance(performanceEntry);
    }
  },
  
  /**
   * Report performance data
   */
  async reportPerformance(data) {
    try {
      await this.post('/performance', data);
    } catch (error) {
      console.warn('Failed to report performance data:', error);
    }
  },
  
  /**
   * Report error
   */
  async reportError(error) {
    const config = this.getConfig();
    
    if (!config.monitoring.errorReporting.enabled) return;
    
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        level: 'error'
      };
      
      await this.post('/errors/report', errorData);
    } catch (reportError) {
      console.warn('Failed to report error:', reportError);
    }
  },
  
  /**
   * ==========================================================================
   * BATCH OPERATIONS
   * ==========================================================================
   */
  
  /**
   * Batch requests
   */
  async batch(requests) {
    const promises = requests.map(req => {
      const { method, endpoint, data, options } = req;
      
      switch (method.toLowerCase()) {
        case 'get':
          return this.get(endpoint, data, options);
        case 'post':
          return this.post(endpoint, data, options);
        case 'put':
          return this.put(endpoint, data, options);
        case 'patch':
          return this.patch(endpoint, data, options);
        case 'delete':
          return this.delete(endpoint, options);
        default:
          return Promise.reject(new Error(`Unsupported method: ${method}`));
      }
    });
    
    return await Promise.allSettled(promises);
  },
  
  /**
   * ==========================================================================
   * OFFLINE SUPPORT
   * ==========================================================================
   */
  
  offlineQueue: [],
  
  /**
   * Queue request for offline
   */
  queueOfflineRequest(method, endpoint, data, options) {
    this.offlineQueue.push({
      method,
      endpoint,
      data,
      options,
      timestamp: Date.now()
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('potensia_offline_queue', JSON.stringify(this.offlineQueue));
  },
  
  /**
   * Process offline queue when back online
   */
  async processOfflineQueue() {
    const queue = JSON.parse(localStorage.getItem('potensia_offline_queue') || '[]');
    
    if (queue.length === 0) return;
    
    const results = [];
    
    for (const request of queue) {
      try {
        const result = await this[request.method](request.endpoint, request.data, request.options);
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error });
      }
    }
    
    // Clear queue
    this.offlineQueue = [];
    localStorage.removeItem('potensia_offline_queue');
    
    return results;
  },
  
  /**
   * ==========================================================================
   * WEBSOCKET SUPPORT
   * ==========================================================================
   */
  
  websocket: null,
  websocketListeners: new Map(),
  
  /**
   * Connect to WebSocket
   */
  connectWebSocket() {
    const config = this.getConfig();
    const wsUrl = config.getBaseUrl().replace('http', 'ws') + '/ws';
    
    this.websocket = new WebSocket(wsUrl);
    
    this.websocket.onopen = () => {
      console.log('WebSocket connected');
      this.emit('websocket:connected');
    };
    
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(`websocket:${data.type}`, data.payload);
    };
    
    this.websocket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('websocket:disconnected');
      
      // Attempt to reconnect
      setTimeout(() => {
        this.connectWebSocket();
      }, 5000);
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('websocket:error', error);
    };
  },
  
  /**
   * Send WebSocket message
   */
  sendWebSocketMessage(type, payload) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type, payload }));
    }
  },
  
  /**
   * Subscribe to WebSocket events
   */
  onWebSocketEvent(event, callback) {
    if (!this.websocketListeners.has(event)) {
      this.websocketListeners.set(event, []);
    }
    
    this.websocketListeners.get(event).push(callback);
  },
  
  /**
   * Emit WebSocket event
   */
  emit(event, data) {
    const listeners = this.websocketListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  },
  
  /**
   * ==========================================================================
   * INITIALIZATION
   * ==========================================================================
   */
  
  /**
   * Initialize API utilities
   */
  init() {
    // Load offline queue
    const savedQueue = localStorage.getItem('potensia_offline_queue');
    if (savedQueue) {
      this.offlineQueue = JSON.parse(savedQueue);
    }
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Back online, processing queued requests');
      this.processOfflineQueue();
    });
    
    window.addEventListener('offline', () => {
      console.log('Gone offline, requests will be queued');
    });
    
    // Connect WebSocket if supported
    const config = this.getConfig();
    if (config.features.websocket) {
      this.connectWebSocket();
    }
    
    // Setup global error handler
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.code) {
        this.reportError(event.reason);
      }
    });
    
    console.log('API utilities initialized');
  },
  
  /**
   * ==========================================================================
   * PUBLIC API INTERFACE
   * ==========================================================================
   */
  
  /**
   * Create public API interface
   */
  createAPI() {
    return {
      // Basic HTTP methods
      get: this.get.bind(this),
      post: this.post.bind(this),
      put: this.put.bind(this),
      patch: this.patch.bind(this),
      delete: this.delete.bind(this),
      
      // Specialized methods
      contact: {
        submit: this.submitContactForm.bind(this),
        newsletter: this.subscribeNewsletter.bind(this)
      },
      
      news: {
        getAll: this.getNews.bind(this),
        getLatest: this.getLatestNews.bind(this)
      },
      
      company: {
        getInfo: this.getCompanyInfo.bind(this),
        getTeam: this.getTeamMembers.bind(this)
      },
      
      services: {
        getAll: this.getServices.bind(this),
        submitInquiry: this.submitServiceInquiry.bind(this)
      },
      
      files: {
        upload: this.uploadFile.bind(this),
        downloadBrochure: this.downloadBrochure.bind(this)
      },
      
      analytics: {
        trackPageView: this.trackPageView.bind(this),
        trackEvent: this.trackEvent.bind(this)
      },
      
      // Utility methods
      clearCache: this.clearCache.bind(this),
      batch: this.batch.bind(this)
    };
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
    ApiUtils.init();
  });
} else {
  ApiUtils.init();
}

/**
 * ==========================================================================
 * EXPORT
 * ==========================================================================
 */

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiUtils;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return ApiUtils;
  });
} else {
  // Create global API instance
  window.PotensiaAPI = ApiUtils.createAPI();
  window.ApiUtils = ApiUtils;
}