/**
 * ==========================================================================
 * POTENSIA INC. - LUCIDE ICONS LIBRARY
 * ==========================================================================
 */

'use strict';

/**
 * Lucide Icons Collection for Potensia Website
 * Optimized subset of commonly used icons
 */
const LucideIcons = {
  /**
   * Create SVG element with icon
   */
  create(iconName, options = {}) {
    const {
      size = 24,
      strokeWidth = 2,
      className = '',
      color = 'currentColor'
    } = options;
    
    const iconData = this.icons[iconName];
    if (!iconData) {
      console.warn(`Icon "${iconName}" not found`);
      return this.createPlaceholder(size, className);
    }
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', strokeWidth);
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    
    if (className) {
      svg.setAttribute('class', className);
    }
    
    // Add icon paths
    iconData.forEach(pathData => {
      if (pathData.type === 'path') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData.d);
        if (pathData.fill) path.setAttribute('fill', pathData.fill);
        svg.appendChild(path);
      } else if (pathData.type === 'circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pathData.cx);
        circle.setAttribute('cy', pathData.cy);
        circle.setAttribute('r', pathData.r);
        if (pathData.fill) circle.setAttribute('fill', pathData.fill);
        svg.appendChild(circle);
      } else if (pathData.type === 'line') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', pathData.x1);
        line.setAttribute('y1', pathData.y1);
        line.setAttribute('x2', pathData.x2);
        line.setAttribute('y2', pathData.y2);
        svg.appendChild(line);
      } else if (pathData.type === 'rect') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', pathData.x);
        rect.setAttribute('y', pathData.y);
        rect.setAttribute('width', pathData.width);
        rect.setAttribute('height', pathData.height);
        if (pathData.rx) rect.setAttribute('rx', pathData.rx);
        if (pathData.fill) rect.setAttribute('fill', pathData.fill);
        svg.appendChild(rect);
      }
    });
    
    return svg;
  },
  
  /**
   * Create placeholder icon
   */
  createPlaceholder(size, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    
    if (className) {
      svg.setAttribute('class', className);
    }
    
    // Question mark placeholder
    svg.innerHTML = '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
    
    return svg;
  },
  
  /**
   * Replace data-icon attributes with actual SVG icons
   */
  replace() {
    const iconElements = document.querySelectorAll('[data-icon]');
    
    iconElements.forEach(element => {
      const iconName = element.dataset.icon;
      const size = element.dataset.iconSize || 24;
      const strokeWidth = element.dataset.iconStroke || 2;
      const className = element.className || '';
      
      const svg = this.create(iconName, {
        size: parseInt(size),
        strokeWidth: parseInt(strokeWidth),
        className: className
      });
      
      // Replace element with SVG
      element.parentNode.replaceChild(svg, element);
    });
  },
  
  /**
   * Icon definitions
   */
  icons: {
    // Navigation Icons
    'menu': [
      { type: 'line', x1: '3', y1: '6', x2: '21', y2: '6' },
      { type: 'line', x1: '3', y1: '12', x2: '21', y2: '12' },
      { type: 'line', x1: '3', y1: '18', x2: '21', y2: '18' }
    ],
    
    'x': [
      { type: 'line', x1: '18', y1: '6', x2: '6', y2: '18' },
      { type: 'line', x1: '6', y1: '6', x2: '18', y2: '18' }
    ],
    
    'chevron-down': [
      { type: 'path', d: 'M6 9l6 6 6-6' }
    ],
    
    'chevron-up': [
      { type: 'path', d: 'M18 15l-6-6-6 6' }
    ],
    
    'chevron-left': [
      { type: 'path', d: 'M15 18l-6-6 6-6' }
    ],
    
    'chevron-right': [
      { type: 'path', d: 'M9 18l6-6-6-6' }
    ],
    
    'arrow-right': [
      { type: 'line', x1: '5', y1: '12', x2: '19', y2: '12' },
      { type: 'path', d: 'L12 5l7 7-7 7' }
    ],
    
    'arrow-left': [
      { type: 'line', x1: '19', y1: '12', x2: '5', y2: '12' },
      { type: 'path', d: 'M12 19l-7-7 7-7' }
    ],
    
    // Business Icons
    'briefcase': [
      { type: 'rect', x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' },
      { type: 'path', d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' }
    ],
    
    'users': [
      { type: 'path', d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
      { type: 'circle', cx: '12', cy: '7', r: '4' }
    ],
    
    'user': [
      { type: 'path', d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
      { type: 'circle', cx: '12', cy: '7', r: '4' }
    ],
    
    'award': [
      { type: 'circle', cx: '12', cy: '8', r: '7' },
      { type: 'path', d: 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12' }
    ],
    
    'target': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'circle', cx: '12', cy: '12', r: '6' },
      { type: 'circle', cx: '12', cy: '12', r: '2' }
    ],
    
    'trending-up': [
      { type: 'path', d: 'M22 7l-8.5 8.5-5-5L2 17' },
      { type: 'path', d: 'M16 7h6v6' }
    ],
    
    'bar-chart-3': [
      { type: 'path', d: 'M3 3v18h18' },
      { type: 'path', d: 'M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' }
    ],
    
    // Technology Icons
    'code': [
      { type: 'path', d: 'M16 18l6-6-6-6' },
      { type: 'path', d: 'M8 6l-6 6 6 6' }
    ],
    
    'smartphone': [
      { type: 'rect', x: '5', y: '2', width: '14', height: '20', rx: '2', ry: '2' },
      { type: 'line', x1: '12', y1: '18', x2: '12.01', y2: '18' }
    ],
    
    'globe': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'line', x1: '2', y1: '12', x2: '22', y2: '12' },
      { type: 'path', d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' }
    ],
    
    'database': [
      { type: 'path', d: 'M12 2c-6 0-10 2-10 4.5s4 4.5 10 4.5 10-2 10-4.5S18 2 12 2z' },
      { type: 'path', d: 'M2 6.5v6c0 2.5 4 4.5 10 4.5s10-2 10-4.5v-6' },
      { type: 'path', d: 'M2 12.5v6c0 2.5 4 4.5 10 4.5s10-2 10-4.5v-6' }
    ],
    
    'cloud': [
      { type: 'path', d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }
    ],
    
    'cpu': [
      { type: 'rect', x: '4', y: '4', width: '16', height: '16', rx: '2', ry: '2' },
      { type: 'rect', x: '9', y: '9', width: '6', height: '6' },
      { type: 'line', x1: '9', y1: '1', x2: '9', y2: '4' },
      { type: 'line', x1: '15', y1: '1', x2: '15', y2: '4' },
      { type: 'line', x1: '9', y1: '20', x2: '9', y2: '23' },
      { type: 'line', x1: '15', y1: '20', x2: '15', y2: '23' },
      { type: 'line', x1: '20', y1: '9', x2: '23', y2: '9' },
      { type: 'line', x1: '20', y1: '14', x2: '23', y2: '14' },
      { type: 'line', x1: '1', y1: '9', x2: '4', y2: '9' },
      { type: 'line', x1: '1', y1: '14', x2: '4', y2: '14' }
    ],
    
    // Content Icons
    'book-open': [
      { type: 'path', d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
      { type: 'path', d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }
    ],
    
    'play-circle': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'path', d: 'M10 8l6 4-6 4V8z' }
    ],
    
    'image': [
      { type: 'rect', x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' },
      { type: 'circle', cx: '8.5', cy: '8.5', r: '1.5' },
      { type: 'path', d: 'M21 15l-5-5L5 21' }
    ],
    
    'video': [
      { type: 'path', d: 'M23 7l-7 5 7 5V7z' },
      { type: 'rect', x: '1', y: '5', width: '15', height: '14', rx: '2', ry: '2' }
    ],
    
    // Communication Icons
    'mail': [
      { type: 'rect', x: '2', y: '4', width: '20', height: '16', rx: '2' },
      { type: 'path', d: 'M22 6l-10 7L2 6' }
    ],
    
    'phone': [
      { type: 'path', d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }
    ],
    
    'message-circle': [
      { type: 'path', d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' }
    ],
    
    // Interface Icons
    'search': [
      { type: 'circle', cx: '11', cy: '11', r: '8' },
      { type: 'path', d: 'M21 21l-4.35-4.35' }
    ],
    
    'filter': [
      { type: 'path', d: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z' }
    ],
    
    'settings': [
      { type: 'circle', cx: '12', cy: '12', r: '3' },
      { type: 'path', d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' }
    ],
    
    'plus': [
      { type: 'line', x1: '12', y1: '5', x2: '12', y2: '19' },
      { type: 'line', x1: '5', y1: '12', x2: '19', y2: '12' }
    ],
    
    'minus': [
      { type: 'line', x1: '5', y1: '12', x2: '19', y2: '12' }
    ],
    
    'check': [
      { type: 'path', d: 'M20 6L9 17l-5-5' }
    ],
    
    'check-circle': [
      { type: 'path', d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' },
      { type: 'path', d: 'M22 4L12 14.01l-3-3' }
    ],
    
    'x-circle': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'line', x1: '15', y1: '9', x2: '9', y2: '15' },
      { type: 'line', x1: '9', y1: '9', x2: '15', y2: '15' }
    ],
    
    'alert-circle': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'line', x1: '12', y1: '8', x2: '12', y2: '12' },
      { type: 'line', x1: '12', y1: '16', x2: '12.01', y2: '16' }
    ],
    
    'info': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'line', x1: '12', y1: '16', x2: '12', y2: '12' },
      { type: 'line', x1: '12', y1: '8', x2: '12.01', y2: '8' }
    ],
    
    // Media Icons
    'eye': [
      { type: 'path', d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
      { type: 'circle', cx: '12', cy: '12', r: '3' }
    ],
    
    'eye-off': [
      { type: 'path', d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' },
      { type: 'line', x1: '1', y1: '1', x2: '23', y2: '23' }
    ],
    
    'share-2': [
      { type: 'circle', cx: '18', cy: '5', r: '3' },
      { type: 'circle', cx: '6', cy: '12', r: '3' },
      { type: 'circle', cx: '18', cy: '19', r: '3' },
      { type: 'line', x1: '8.59', y1: '13.51', x2: '15.42', y2: '17.49' },
      { type: 'line', x1: '15.41', y1: '6.51', x2: '8.59', y2: '10.49' }
    ],
    
    'bookmark-plus': [
      { type: 'path', d: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' },
      { type: 'line', x1: '12', y1: '7', x2: '12', y2: '13' },
      { type: 'line', x1: '9', y1: '10', x2: '15', y2: '10' }
    ],
    
    // Time Icons
    'calendar': [
      { type: 'rect', x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' },
      { type: 'line', x1: '16', y1: '2', x2: '16', y2: '6' },
      { type: 'line', x1: '8', y1: '2', x2: '8', y2: '6' },
      { type: 'line', x1: '3', y1: '10', x2: '21', y2: '10' }
    ],
    
    'clock': [
      { type: 'circle', cx: '12', cy: '12', r: '10' },
      { type: 'path', d: 'M12 6v6l4 2' }
    ],
    
    // Special Icons
    'zap': [
      { type: 'path', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' }
    ],
    
    'heart': [
      { type: 'path', d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }
    ],
    
    'star': [
      { type: 'path', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }
    ],
    
    'shield': [
      { type: 'path', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }
    ],
    
    'lightbulb': [
      { type: 'path', d: 'M9 21h6' },
      { type: 'path', d: 'M12 17v-2a4 4 0 1 0-4-4 2 2 0 0 0 2-2c0-1.1.9-2 2-2s2 .9 2 2a2 2 0 0 0 2 2 4 4 0 1 0-4 4v2' }
    ],
    
    'download': [
      { type: 'path', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
      { type: 'path', d: 'M7 10l5 5 5-5' },
      { type: 'line', x1: '12', y1: '15', x2: '12', y2: '3' }
    ],
    
    'upload': [
      { type: 'path', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
      { type: 'path', d: 'M17 8l-5-5-5 5' },
      { type: 'line', x1: '12', y1: '3', x2: '12', y2: '15' }
    ],
    
    'external-link': [
      { type: 'path', d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' },
      { type: 'path', d: 'M15 3h6v6' },
      { type: 'line', x1: '10', y1: '14', x2: '21', y2: '3' }
    ],
    
    'link': [
      { type: 'path', d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' },
      { type: 'path', d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }
    ],
    
    'tag': [
      { type: 'path', d: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' },
      { type: 'line', x1: '7', y1: '7', x2: '7.01', y2: '7' }
    ],
    
    // Loading and Status
    'loader': [
      { type: 'line', x1: '12', y1: '2', x2: '12', y2: '6' },
      { type: 'line', x1: '12', y1: '18', x2: '12', y2: '22' },
      { type: 'line', x1: '4.93', y1: '4.93', x2: '7.76', y2: '7.76' },
      { type: 'line', x1: '16.24', y1: '16.24', x2: '19.07', y2: '19.07' },
      { type: 'line', x1: '2', y1: '12', x2: '6', y2: '12' },
      { type: 'line', x1: '18', y1: '12', x2: '22', y2: '12' },
      { type: 'line', x1: '4.93', y1: '19.07', x2: '7.76', y2: '16.24' },
      { type: 'line', x1: '16.24', y1: '7.76', x2: '19.07', y2: '4.93' }
    ],
    
    'refresh-cw': [
      { type: 'path', d: 'M3 2v6h6' },
      { type: 'path', d: 'M21 12A9 9 0 0 0 6 5.3L3 8' },
      { type: 'path', d: 'M21 22v-6h-6' },
      { type: 'path', d: 'M3 12a9 9 0 0 0 15 6.7l3-2.7' }
    ]
  },
  
  /**
   * Batch replace icons in a container
   */
  replaceIn(container) {
    const iconElements = container.querySelectorAll('[data-icon]');
    
    iconElements.forEach(element => {
      const iconName = element.dataset.icon;
      const size = element.dataset.iconSize || 24;
      const strokeWidth = element.dataset.iconStroke || 2;
      const className = element.className || '';
      
      const svg = this.create(iconName, {
        size: parseInt(size),
        strokeWidth: parseInt(strokeWidth),
        className: className
      });
      
      // Copy attributes
      Array.from(element.attributes).forEach(attr => {
        if (!attr.name.startsWith('data-icon')) {
          svg.setAttribute(attr.name, attr.value);
        }
      });
      
      // Replace element with SVG
      element.parentNode.replaceChild(svg, element);
    });
  },
  
  /**
   * Get icon as HTML string
   */
  getHtml(iconName, options = {}) {
    const svg = this.create(iconName, options);
    return svg.outerHTML;
  },
  
  /**
   * Add custom icon
   */
  addIcon(name, pathData) {
    this.icons[name] = pathData;
  },
  
  /**
   * List available icons
   */
  getAvailableIcons() {
    return Object.keys(this.icons).sort();
  },
  
  /**
   * Initialize icon replacement on page load
   */
  init() {
    // Replace icons when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.replace();
      });
    } else {
      this.replace();
    }
    
    // Watch for dynamically added icons
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.hasAttribute && node.hasAttribute('data-icon')) {
                const iconName = node.dataset.icon;
                const size = node.dataset.iconSize || 24;
                const strokeWidth = node.dataset.iconStroke || 2;
                const className = node.className || '';
                
                const svg = this.create(iconName, {
                  size: parseInt(size),
                  strokeWidth: parseInt(strokeWidth),
                  className: className
                });
                
                node.parentNode.replaceChild(svg, node);
              } else {
                // Check for icons within the added node
                this.replaceIn(node);
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    console.log('Lucide Icons initialized');
  }
};

/**
 * ==========================================================================
 * UTILITY FUNCTIONS
 * ==========================================================================
 */

/**
 * Create icon element shorthand
 */
window.createIcon = function(iconName, options = {}) {
  return LucideIcons.create(iconName, options);
};

/**
 * Get icon HTML shorthand
 */
window.getIconHtml = function(iconName, options = {}) {
  return LucideIcons.getHtml(iconName, options);
};

/**
 * Replace icons in specific container
 */
window.replaceIconsIn = function(container) {
  LucideIcons.replaceIn(container);
};

/**
 * ==========================================================================
 * AUTO-INITIALIZATION
 * ==========================================================================
 */
LucideIcons.init();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LucideIcons;
}

// Make available globally
window.LucideIcons = LucideIcons;