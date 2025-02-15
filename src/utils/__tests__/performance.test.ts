import { performance } from 'perf_hooks'
import { measureTimeToFirstByte, measureLargestContentfulPaint } from '../performance'

describe('Performance Utilities', () => {
  beforeEach(() => {
    // Mock performance API
    global.performance = performance
    global.PerformanceObserver = class {
      constructor(callback: any) {
        setTimeout(() => {
          callback({
            getEntries: () => [{
              startTime: 100,
              renderTime: 500,
              size: 1000
            }]
          })
        }, 0)
      }
      observe() {}
      disconnect() {}
    }
  })

  it('should measure Time to First Byte', async () => {
    const ttfb = await measureTimeToFirstByte()
    expect(ttfb).toBeLessThan(600) // 600ms threshold
  })

  it('should measure Largest Contentful Paint', async () => {
    const lcp = await measureLargestContentfulPaint()
    expect(lcp).toBeLessThan(2500) // 2.5s threshold
  })
})