import { useEffect, useState } from 'react';

export function useWebSockets() {
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('deceivenet_access');
    if (!token) return;

    let wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) {
      const apiOrigin = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = new URL(apiOrigin);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${url.host}/api/ws`;
    }
    const wsPath = wsUrl.endsWith('/api/ws') ? wsUrl : `${wsUrl}/api/ws`;
    const ws = new WebSocket(`${wsPath}?token=${token}`);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === 'event.processed') {
          setLastEvent(data.data);
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { lastEvent, connected };
}
