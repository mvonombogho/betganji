import { Server } from 'ws';
import type { Server as HTTPServer } from 'http';

export interface WebSocketMessage {
  type: 'MATCH_UPDATE' | 'ODDS_UPDATE' | 'ERROR';
  payload: any;
}

export class WebSocketServer {
  private wss: Server;
  private clients: Set<WebSocket>;

  constructor(server: HTTPServer) {
    this.wss = new Server({ server });
    this.clients = new Set();

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.sendToClient(ws, {
          type: 'ERROR',
          payload: 'Connection error',
        });
      });
    });
  }

  private sendToClient(client: WebSocket, message: WebSocketMessage) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  public broadcast(message: WebSocketMessage) {
    this.clients.forEach(client => {
      this.sendToClient(client, message);
    });
  }

  public broadcastMatchUpdate(matchId: string, data: any) {
    this.broadcast({
      type: 'MATCH_UPDATE',
      payload: {
        matchId,
        ...data,
      },
    });
  }

  public broadcastOddsUpdate(matchId: string, odds: any) {
    this.broadcast({
      type: 'ODDS_UPDATE',
      payload: {
        matchId,
        odds,
      },
    });
  }
}
