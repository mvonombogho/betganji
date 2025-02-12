'use client'

import { useState } from "react"
import { Match } from "@/types/match"
import { MatchCard } from "./match-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MatchListProps {
  matches: Match[]
  showFilters?: boolean
}

type FilterStatus = 'all' | 'live' | 'upcoming' | 'finished'

export function MatchList({ matches, showFilters = true }: MatchListProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [competitionFilter, setCompetitionFilter] = useState<string>('all')

  // Get unique competitions from matches
  const competitions = Array.from(
    new Set(matches.map(match => match.competition.id))
  ).map(id => {
    const match = matches.find(m => m.competition.id === id)
    return {
      id,
      name: match?.competition.name || '',
    }
  })

  // Filter matches based on selected filters
  const filteredMatches = matches.filter(match => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'upcoming' && match.status !== 'scheduled') return false
      if (statusFilter === 'live' && match.status !== 'live') return false
      if (statusFilter === 'finished' && match.status !== 'finished') return false
    }
    
    if (competitionFilter !== 'all' && match.competition.id !== competitionFilter) {
      return false
    }
    
    return true
  })

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const date = new Date(match.kickoff).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(match)
    return groups
  }, {} as Record<string, Match[]>)

  if (!matches.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No matches found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-4">
          <div className="w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as FilterStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {competitions.length > 1 && (
            <div className="w-[200px]">
              <Select
                value={competitionFilter}
                onValueChange={setCompetitionFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by competition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitions</SelectItem>
                  {competitions.map(competition => (
                    <SelectItem 
                      key={competition.id} 
                      value={competition.id}
                    >
                      {competition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedMatches).map(([date, matches]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold mb-4">{date}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}