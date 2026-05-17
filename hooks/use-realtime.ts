"use client";
import { useEffect, useState } from 'react';

interface EventPayload {
  type: string;
  payload: any;
  timestamp: string;
}

export function useRealtimeSync(brandId: string) {
  const [status, setStatus] = useState<string>('CONNECTING');
  const [events, setEvents] = useState<EventPayload[]>([]);

  useEffect(() => {
    // Need to connect to current host correctly
    // It's on the same domain as the app. It's proxied natively if we use Next.js server routing we made
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/v1/stream?brandId=${brandId}`);

    ws.onopen = () => {
      setStatus('ONLINE');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [data, ...prev].slice(0, 50));
        if (data.type === 'INTEGRATION_STATUS') {
          setStatus(data.payload.status);
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onclose = () => {
      setStatus('OFFLINE');
    };

    return () => {
      ws.close();
    };
  }, [brandId]);

  return { status, events };
}
