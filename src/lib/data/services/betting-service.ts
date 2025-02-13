import { db } from "@/lib/db"
import { 
  type BankrollConfig, 
  type BettingSite as BettingSiteType,
  type PlacedBet,
  type BetStatus 
} from "@/types/betting"

export class BettingService {
  async initializeBankroll(userId: string, config: BankrollConfig) {
    const bankroll = await db.bankroll.create({
      data: {
        userId,
        initialCapital: config.initialCapital,
        currentBalance: config.initialCapital,
        currency: config.currency,
        maxStakePerBet: config.maxStakePerBet,
        maxStakePerDay: config.maxStakePerDay,
        stakeUnit: config.stakeUnit,
        stopLoss: config.stopLoss,
        targetProfit: config.targetProfit,
      }
    })

    await db.bankrollHistory.create({
      data: {
        bankrollId: bankroll.id,
        balance: config.initialCapital,
        change: config.initialCapital,
        reason: "Initial deposit"
      }
    })

    return bankroll
  }

  async addBettingSite(bankrollId: string, site: Omit<BettingSiteType, 'id'>) {
    return db.bettingSite.create({
      data: {
        bankrollId,
        name: site.name,
        currentBalance: site.currentBalance,
        totalDeposited: site.totalDeposited,
        totalWithdrawn: site.totalWithdrawn,
      }
    })
  }

  async updateBettingSiteBalance(siteId: string, newBalance: number) {
    const site = await db.bettingSite.findUnique({
      where: { id: siteId },
      include: { bankroll: true }
    })

    if (!site) throw new Error("Betting site not found")

    const change = newBalance - site.currentBalance

    // Update site balance
    await db.bettingSite.update({
      where: { id: siteId },
      data: { currentBalance: newBalance }
    })

    // Update bankroll balance
    await db.bankroll.update({
      where: { id: site.bankrollId },
      data: { currentBalance: site.bankroll.currentBalance + change }
    })

    // Record the change in history
    await db.bankrollHistory.create({
      data: {
        bankrollId: site.bankrollId,
        balance: site.bankroll.currentBalance + change,
        change,
        reason: `Balance update for ${site.name}`
      }
    })
  }

  async placeBet(bet: Omit<PlacedBet, 'id' | 'createdAt' | 'updatedAt'>) {
    const bankroll = await db.bankroll.findUnique({
      where: { userId: bet.userId },
      include: {
        bettingSites: true
      }
    })

    if (!bankroll) throw new Error("Bankroll not found")

    // Check if stake exceeds limits
    if (bet.stake > bankroll.maxStakePerBet) {
      throw new Error("Stake exceeds maximum allowed per bet")
    }

    // Check daily stake limit
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todayStakes = await db.placedBet.aggregate({
      where: {
        userId: bet.userId,
        placedAt: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      _sum: {
        stake: true
      }
    })

    if ((todayStakes._sum.stake || 0) + bet.stake > bankroll.maxStakePerDay) {
      throw new Error("Daily stake limit exceeded")
    }

    // Place the bet
    const placedBet = await db.placedBet.create({
      data: bet
    })

    // Update site and bankroll balances
    const site = bankroll.bettingSites.find(s => s.name === bet.bettingSite)
    if (site) {
      await this.updateBettingSiteBalance(site.id, site.currentBalance - bet.stake)
    }

    return placedBet
  }

  async settleBet(betId: string, status: BetStatus, result?: string) {
    const bet = await db.placedBet.findUnique({
      where: { id: betId },
      include: {
        user: {
          include: {
            bankroll: {
              include: {
                bettingSites: true
              }
            }
          }
        }
      }
    })

    if (!bet) throw new Error("Bet not found")
    if (bet.status !== 'pending') throw new Error("Bet already settled")

    let profitLoss = -bet.stake // Default to loss

    if (status === 'won') {
      profitLoss = bet.potentialWin - bet.stake
    } else if (status === 'void') {
      profitLoss = 0
    }

    // Update bet
    const updatedBet = await db.placedBet.update({
      where: { id: betId },
      data: {
        status,
        result,
        profitLoss,
        settledAt: new Date()
      }
    })

    // Update site and bankroll balances if bet is won
    if (status === 'won' || status === 'void') {
      const site = bet.user.bankroll?.bettingSites.find(
        s => s.name === bet.bettingSite
      )
      if (site) {
        const returnAmount = status === 'won' ? bet.potentialWin : bet.stake
        await this.updateBettingSiteBalance(
          site.id, 
          site.currentBalance + returnAmount
        )
      }
    }

    return updatedBet
  }

  async getBettingStats(userId: string) {
    const bets = await db.placedBet.findMany({
      where: { userId }
    })

    const stats = {
      totalBets: bets.length,
      wonBets: bets.filter(b => b.status === 'won').length,
      lostBets: bets.filter(b => b.status === 'lost').length,
      voidBets: bets.filter(b => b.status === 'void').length,
      totalStaked: bets.reduce((sum, bet) => sum + bet.stake, 0),
      totalReturns: bets.reduce((sum, bet) => {
        if (bet.status === 'won') return sum + bet.potentialWin
        if (bet.status === 'void') return sum + bet.stake
        return sum
      }, 0),
    }

    const winRate = stats.wonBets / (stats.totalBets - stats.voidBets) * 100
    const profit = stats.totalReturns - stats.totalStaked
    const roi = (profit / stats.totalStaked) * 100

    return {
      ...stats,
      winRate: Number(winRate.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      roi: Number(roi.toFixed(2))
    }
  }
}