import { Match } from "@/types/match"

type MatchUpdateType = 'score' | 'stats' | 'odds' | 'status'

interface MatchUpdate {
  matchId: string
  type: MatchUpdateType
  data: Partial<Match>
  timestamp: Date
}

class MatchLiveService {
  private eventSource: EventSource | null = null
  private listeners: Map<string, Set<(update: MatchUpdate) => void>> = new Map()

  connect(matchId: string) {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return
    }

    this.eventSource = new EventSource(`/api/matches/${matchId}/live`)

    this.eventSource.onmessage = (event) => {
      const update: MatchUpdate = JSON.parse(event.data)
      this.notifyListeners(update.matchId, update)
    }

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      this.eventSource?.close()
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(matchId), 5000)
    }
  }

  subscribe(matchId: string, callback: (update: MatchUpdate) => void) {
    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, new Set())
    }
    this.listeners.get(matchId)?.add(callback)

    // Start connection if not already connected
    this.connect(matchId)

    // Return unsubscribe function
    return () => {
      const matchListeners = this.listeners.get(matchId)
      if (matchListeners) {
        matchListeners.delete(callback)
        if (matchListeners.size === 0) {
          this.listeners.delete(matchId)
          if (this.listeners.size === 0) {
            this.disconnect()
          }
        }
      }
    }
  }

  private notifyListeners(matchId: string, update: MatchUpdate) {
    this.listeners.get(matchId)?.forEach(callback => callback(update))
  }

  disconnect() {
    this.eventSource?.close()
    this.eventSource = null
  }
}

// Export singleton instance
export const matchLiveService = new MatchLiveService()