'use client'

import { useState } from "react"
import { Banknote, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import type { Bankroll, BettingStats } from "@/types/betting"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface BankrollOverviewProps {
  bankroll: Bankroll
  stats: BettingStats
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`
}

export function BankrollOverview({ bankroll, stats }: BankrollOverviewProps) {
  const [showRiskAlert, setShowRiskAlert] = useState(false)
  const profitLoss = stats.totalReturns - stats.totalStaked
  const isProfit = profitLoss >= 0

  // Calculate daily usage percentages
  const todayStakes = stats.totalStaked // This should be filtered for today in a real app
  const dailyStakePercentage = (todayStakes / bankroll.maxStakePerDay) * 100

  // Check if approaching limits
  const isApproachingDailyLimit = dailyStakePercentage > 80

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bankroll.currentBalance, bankroll.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Initial: {formatCurrency(bankroll.initialCapital, bankroll.currency)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profit/Loss
            </CardTitle>
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              isProfit ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(profitLoss, bankroll.currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              ROI: {formatPercentage(stats.roi)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats.winRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.wonBets} wins, {stats.lostBets} losses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alerts */}
      {isApproachingDailyLimit && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You are approaching your daily stake limit. Consider stopping for today.
          </AlertDescription>
        </Alert>
      )}

      {/* Daily Limits Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Stakes Used</span>
                <span>{formatCurrency(todayStakes, bankroll.currency)} / {formatCurrency(bankroll.maxStakePerDay, bankroll.currency)}</span>
              </div>
              <Progress value={dailyStakePercentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Betting Sites */}
      <Card>
        <CardHeader>
          <CardTitle>Betting Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Total Deposited</TableHead>
                <TableHead className="text-right">Total Withdrawn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankroll.bettingSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(site.currentBalance, bankroll.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(site.totalDeposited, bankroll.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(site.totalWithdrawn, bankroll.currency)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowRiskAlert(true)}
                  >
                    Add Betting Site
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Stake Limits</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Per Bet:</span>
                  <span>{formatCurrency(bankroll.maxStakePerBet, bankroll.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Per Day:</span>
                  <span>{formatCurrency(bankroll.maxStakePerDay, bankroll.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stake Unit:</span>
                  <span className="capitalize">{bankroll.stakeUnit}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Stop Conditions</h4>
              <div className="space-y-1">
                {bankroll.stopLoss && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Stop Loss:</span>
                    <span>{formatCurrency(bankroll.stopLoss, bankroll.currency)}</span>
                  </div>
                )}
                {bankroll.targetProfit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Profit Target:</span>
                    <span>{formatCurrency(bankroll.targetProfit, bankroll.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}