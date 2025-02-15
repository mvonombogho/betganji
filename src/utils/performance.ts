export const measureTimeToFirstByte = async (): Promise<number> => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  return navigation.responseStart - navigation.requestStart
}

export const measureLargestContentfulPaint = async (): Promise<number> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      resolve(lastEntry.renderTime || lastEntry.loadTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  })
}

export const measureFirstInputDelay = async (): Promise<number> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0]
      resolve(firstInput.processingStart - firstInput.startTime)
    }).observe({ entryTypes: ['first-input'] })
  })
}

export const reportPerformanceMetrics = async () => {
  try {
    const ttfb = await measureTimeToFirstByte()
    const lcp = await measureLargestContentfulPaint()
    const fid = await measureFirstInputDelay()

    // Send metrics to analytics
    console.log('Performance Metrics:', {
      timeToFirstByte: ttfb,
      largestContentfulPaint: lcp,
      firstInputDelay: fid
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.table({
        'Time to First Byte': `${ttfb.toFixed(2)}ms`,
        'Largest Contentful Paint': `${(lcp / 1000).toFixed(2)}s`,
        'First Input Delay': `${fid.toFixed(2)}ms`
      })
    }
  } catch (error) {
    console.error('Error measuring performance:', error)
  }
}