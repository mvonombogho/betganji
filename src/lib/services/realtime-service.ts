type MessageHandler = (data: any) => void;

class RealtimeService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private pendingMessages: Array<{ type: string; data: any }> = [];

  constructor() {
    this.setupConnectionMonitoring();
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    try {
      this.socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || '');
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  subscribe(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)?.add(handler);

    // If we're connected, subscribe to the type
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: 'subscribe', type }));
    }

    return () => this.unsubscribe(type, handler);
  }

  private unsubscribe(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
        // If we're connected, unsubscribe from the type
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ action: 'unsubscribe', type }));
        }
      }
    }
  }

  private handleOpen() {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;

    // Resubscribe to all types
    for (const type of this.handlers.keys()) {
      this.socket?.send(JSON.stringify({ action: 'subscribe', type }));
    }

    // Send any pending messages
    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();
      if (message) {
        this.publish(message.type, message.data);
      }
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const { type, data } = JSON.parse(event.data);
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`Handler error for type ${type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Message parsing error:', error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    this.socket = null;
    this.attemptReconnect();
  }

  private handleError(event: Event) {
    console.error('WebSocket error:', event);
    this.socket?.close();
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectDelay *= 2; // Exponential backoff

    console.log(`Attempting to reconnect in ${this.reconnectDelay}ms...`);
    setTimeout(() => this.connect(), this.reconnectDelay);
  }

  publish(type: string, data: any) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push({ type, data });
      return;
    }

    this.socket.send(JSON.stringify({ type, data }));
  }

  private setupConnectionMonitoring() {
    // Monitor online/offline status
    window.addEventListener('online', () => this.connect());
    window.addEventListener('offline', () => this.socket?.close());

    // Monitor visibility for tab changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.connect();
      }
    });
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.handlers.clear();
    this.pendingMessages = [];
  }
}

export const realtimeService = new RealtimeService();
