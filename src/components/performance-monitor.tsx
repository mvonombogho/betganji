import { useEffect } from 'react'
import { reportPerformanceMetrics } from '@/utils/performance'

export function PerformanceMonitor() {
  useEffect(() => {
    // Report metrics after the page has loaded
    if (document.readyState === 'complete') {
      reportPerformanceMetrics()
    } else {
      window.addEventListener('load', reportPerformanceMetrics)
      return () => window.removeEventListener('load', reportPerformanceMetrics)
    }
  }, [])

  return null
}