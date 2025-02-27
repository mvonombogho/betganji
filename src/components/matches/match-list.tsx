"use client";

import React, { useState, useMemo } from 'react';
import { Match, Team, Competition } from '@/types/match';
import { Odds } from '@/types/odds';
import { Prediction } from '@/types/prediction';
import { MatchCard } from './match-card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type MatchWithRelations = Match & {
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  odds?: Odds[];
};

interface MatchListProps {
  matches: MatchWithRelations[];
  predictions?: Prediction[];
  className?: string;
}

export function MatchList({ matches, predictions = [], className = "" }: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [competition, setCompetition] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Get list of unique competitions
  const competitions = useMemo(() => {
    const uniqueCompetitions = new Set<string>();
    matches.forEach(match => {
      uniqueCompetitions.add(match.competition.name);
    });
    return Array.from(uniqueCompetitions);
  }, [matches]);
  
  // Generate prediction lookup map for quick access
  const predictionMap = useMemo(() => {
    const map = new Map<string, Prediction>();
    predictions.forEach(prediction => {
      map.set(prediction.matchId, prediction);
    });
    return map;
  }, [predictions]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return matches.filter(match => {
      // Text search
      const matchesSearch = searchTerm === '' || 
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.competition.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Competition filter
      const matchesCompetition = competition === 'all' || match.competition.name === competition;
      
      // Date filter
      const matchDate = new Date(match.datetime);
      const matchesDate = 
        dateFilter === 'all' || 
        (dateFilter === 'today' && matchDate >= today && matchDate < tomorrow) ||
        (dateFilter === 'tomorrow' && matchDate >= tomorrow && matchDate < new Date(tomorrow.getTime() + 86400000));
      
      // Status filter
      const matchesTab = 
        (activeTab === 'upcoming' && match.status !== 'FINISHED' && match.status !== 'CANCELLED') ||
        (activeTab === 'finished' && match.status === 'FINISHED') ||
        (activeTab === 'predicted' && predictionMap.has(match.id));
      
      return matchesSearch && matchesCompetition && matchesDate && matchesTab;
    }).sort((a, b) => {
      // Sort by:
      // 1. LIVE matches first
      // 2. Then upcoming matches by date
      // 3. Then finished matches by date (most recent first)
      if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
      if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;
      
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      
      if (a.status === 'FINISHED' && b.status === 'FINISHED') {
        return dateB.getTime() - dateA.getTime(); // Most recent first for finished matches
      }
      
      return dateA.getTime() - dateB.getTime(); // Earliest first for upcoming matches
    });
  }, [matches, searchTerm, competition, dateFilter, activeTab, predictionMap]);

  if (!matches.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No matches found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
            <TabsTrigger value="finished" className="flex-1">Finished</TabsTrigger>
            <TabsTrigger value="predicted" className="flex-1">Predicted</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search teams or competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2"
          />
          
          <div className="flex gap-3 w-full sm:w-1/2">
            <Select value={competition} onValueChange={setCompetition}>
              <SelectTrigger>
                <SelectValue placeholder="Competition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {competitions.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Match List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMatches.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No matches found with the current filters</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const prediction = predictionMap.get(match.id);
            
            return (
              <MatchCard 
                key={match.id}
                id={match.id}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                competition={match.competition}
                datetime={match.datetime}
                status={match.status}
                score={match.score}
                odds={match.odds?.[0] && {
                  homeWin: match.odds[0].homeWin,
                  draw: match.odds[0].draw,
                  awayWin: match.odds[0].awayWin
                }}
                hasPrediction={!!prediction}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
