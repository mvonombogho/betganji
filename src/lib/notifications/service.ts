import type { TimelineEvent } from '@/types/match';

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission: boolean = false;

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.hasPermission = permission === 'granted';
    return this.hasPermission;
  }

  public async notify(title: string, options?: NotificationOptions) {
    if (!this.hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    return new Notification(title, options);
  }

  public async notifyMatchEvent(event: TimelineEvent, matchDetails: string) {
    const eventIcons: Record<string, string> = {
      GOAL: '⚽',
      YELLOW_CARD: '🟨',
      RED_CARD: '🟥',
      SUBSTITUTION: '🔄',
      PENALTY_MISSED: '❌',
      PENALTY_SCORED: '⚽',
      VAR: '📺'
    };

    const icon = eventIcons[event.type] || '⚽';
    const title = `${icon} ${event.type.replace('_', ' ')} - ${matchDetails}`;
    const body = `${event.minute}' - ${event.playerName}${event.additionalInfo ? ` (${event.additionalInfo})` : ''}`;

    return this.notify(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      tag: `match-${event.type}-${event.id}`,
      renotify: true
    });
  }

  public async notifyOddsChange(matchDetails: string, changeType: string, oldOdds: number, newOdds: number) {
    const title = `📊 Odds Update - ${matchDetails}`;
    const body = `${changeType}: ${oldOdds.toFixed(2)} → ${newOdds.toFixed(2)}`;

    return this.notify(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `odds-${matchDetails}-${Date.now()}`,
      renotify: true
    });
  }
}