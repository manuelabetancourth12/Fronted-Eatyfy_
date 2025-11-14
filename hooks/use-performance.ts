import React, { useEffect, useState } from 'react'

// Web Vitals monitoring can be added later when types are properly configured
// For now, we focus on basic performance utilities and navigation timing

// Performance monitoring hook for EatyFy
export function usePerformance() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
  })

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return

    // Basic performance monitoring (Web Vitals can be added later when types are properly configured)
    // For now, we'll track basic navigation timing

    // Navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any

        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          const domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart

          if (process.env.NODE_ENV === 'production') {
            console.log('Page Load Time:', loadTime)
            console.log('DOM Ready Time:', domReady)
          }
        }
      })
    }
  }, [])

  return metrics
}

// Performance optimization utilities
export const performanceUtils = {
  // Lazy load components
  lazyLoad: (importFunc: () => Promise<any>) => {
    return React.lazy(importFunc)
  },

  // Debounce function for search inputs
  debounce: (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(null, args), wait)
    }
  },

  // Throttle function for scroll events
  throttle: (func: Function, limit: number) => {
    let inThrottle: boolean
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Preload critical resources
  preloadImage: (src: string) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  },

  // Service worker registration for caching
  registerSW: () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => console.log('SW registered'))
          .catch(error => console.log('SW registration failed'))
      })
    }
  }
}