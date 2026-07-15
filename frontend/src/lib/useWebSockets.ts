import { useEffect, useState } from 'react';
import { getWebSocketUrl } from './config';

export function useWebSockets() {
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('deceivenet_access');
    if (!token) return;

    const ws = new WebSocket(`${getWebSocketUrl()}?token=${token}`);

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
