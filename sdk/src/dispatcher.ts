import axios from 'axios';
import crypto from 'crypto';

export interface DeceiveNetConfig {
  projectId: string;
  token: string;
  endpoint?: string;
  debug?: boolean;
  privacy?: {
    redactHeaders?: boolean;
    redactCookies?: boolean;
    captureBodies?: boolean;
    maxPayloadSize?: number;
  };
}

export class TelemetryDispatcher {
  private queue: any[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private config: DeceiveNetConfig;
  private endpoint: string;

  constructor(config: DeceiveNetConfig) {
    this.config = config;
    this.endpoint = config.endpoint || 'https://api.deceivenet.com/sdk/events';
    
    // Batch flush every 2 seconds
    this.flushInterval = setInterval(() => this.flush(), 2000);
  }

  private logDebug(msg: string, ...args: any[]) {
    if (this.config.debug) {
      console.log(`[DeceiveNet SDK] ${msg}`, ...args);
    }
  }

  public enqueue(event: any) {
    if (this.queue.length >= 1000) {
      this.logDebug('Queue full (backpressure threshold reached). Dropping event.');
      return;
    }
    this.queue.push(event);
    if (this.queue.length >= 50) {
      this.logDebug('Batch size reached, triggering flush.');
      this.flush();
    }
  }

  private generateSignature(payloadStr: string, timestamp: number): string {
    const hmac = crypto.createHmac('sha256', this.config.token);
    hmac.update(`${timestamp}.${payloadStr}`);
    return hmac.digest('hex');
  }

  public async flush() {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    const payload = {
      projectId: this.config.projectId,
      events: batch
    };

    const payloadStr = JSON.stringify(payload, Object.keys(payload).sort());
    const timestamp = Date.now();
    const signature = this.generateSignature(payloadStr, timestamp);

    try {
      this.logDebug(`Flushing ${batch.length} events to ${this.endpoint}`);
      await axios.post(this.endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-DeceiveNet-Signature': signature,
          'X-DeceiveNet-Timestamp': timestamp.toString(),
          'X-DeceiveNet-SDK-Version': '1.0.0',
          'User-Agent': 'DeceiveNet-SDK/1.0.0'
        },
        timeout: 5000
      });
      this.logDebug('Batch flush successful.');
    } catch (e: any) {
      this.logDebug('Batch flush failed. Buffering events for retry.', e.message);
      // Offline buffering: Push failed events back onto queue
      // Queue size limited to 1000 to prevent OOM
      if (this.queue.length + batch.length <= 1000) {
         this.queue.unshift(...batch);
      }
    }
  }

  public shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}
