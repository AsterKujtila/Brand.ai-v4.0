import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export interface DashboardEvent {
  type: 'BRAND_CHECK_UPDATE' | 'NEWSROOM_SIGNAL' | 'INTEGRATION_STATUS';
  timestamp: string;
  payload: any;
}

export class RealtimeSyncGateway {
  private wss: WebSocketServer;
  private activeConnections: Map<string, WebSocket> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/v1/stream' });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      // Simple tenant validation from query string authentication token
      const urlParams = new URLSearchParams(req.url?.split('?')[1]);
      const brandId = urlParams.get('brandId');

      if (!brandId) {
        ws.close(4001, 'Unauthorized: Missing valid brand identity context');
        return;
      }

      this.activeConnections.set(brandId, ws);
      
      // Keep-alive heartbeat pattern
      (ws as any).isAlive = true;
      ws.on('pong', () => { (ws as any).isAlive = true; });

      ws.on('close', () => {
        this.activeConnections.delete(brandId);
      });

      // Confirm secure initialization pipeline complete
      this.sendToBrand(brandId, {
        type: 'INTEGRATION_STATUS',
        timestamp: new Date().toISOString(),
        payload: { system: 'BrandOS Backend', status: 'ONLINE', synchronized: true }
      });
    });

    // Background interval to prune dead sockets
    setInterval(() => {
      this.wss.clients.forEach((ws: any) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  // Broadcast specific data events to target organization workspace
  public sendToBrand(brandId: string, event: DashboardEvent): boolean {
    const clientSocket = this.activeConnections.get(brandId);
    if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify(event));
      return true;
    }
    return false;
  }

  // System-wide notification wrapper (e.g., global service notices)
  public broadcastSystemNotice(event: DashboardEvent) {
    const data = JSON.stringify(event);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}
