import { Server } from 'http';
import { createHttpHoneypot } from './httpHoneypot.js';

interface ActiveHoneypot {
  server: Server;
  port: number;
  status: 'deploying' | 'running' | 'stopped' | 'error';
}

class HoneypotRuntimeManager {
  private activeHoneypots = new Map<string, ActiveHoneypot>();

  /**
   * Starts a honeypot listener safely.
   */
  public async start(honeypotId: string, port: number, type: string): Promise<boolean> {
    if (this.activeHoneypots.has(honeypotId)) {
      console.warn(`Honeypot ${honeypotId} is already running.`);
      return false;
    }

    if (port < 1024 || port > 65535) {
      throw new Error(`Invalid port ${port}. Must be between 1024 and 65535.`);
    }

    // Ensure port is not used by another honeypot in our runtime
    for (const hp of this.activeHoneypots.values()) {
      if (hp.port === port) {
        throw new Error(`Port ${port} is already in use by another active honeypot.`);
      }
    }

    try {
      let server: Server;
      if (type.toUpperCase() === 'HTTP') {
        server = createHttpHoneypot(honeypotId, port);
      } else {
        // Fallback or generic simulation for other types for now
        server = createHttpHoneypot(honeypotId, port);
      }

      this.activeHoneypots.set(honeypotId, {
        server,
        port,
        status: 'running',
      });

      return true;
    } catch (e) {
      console.error(`Failed to start honeypot ${honeypotId} on port ${port}:`, e);
      return false;
    }
  }

  /**
   * Stops a running honeypot and releases the port.
   */
  public async stop(honeypotId: string): Promise<boolean> {
    const hp = this.activeHoneypots.get(honeypotId);
    if (!hp) {
      return false;
    }

    return new Promise((resolve) => {
      hp.server.close((err) => {
        if (err) {
          console.error(`Error closing honeypot ${honeypotId}:`, err);
        }
        this.activeHoneypots.delete(honeypotId);
        resolve(true);
      });
    });
  }

  /**
   * Gets the status of a specific honeypot in memory.
   */
  public getStatus(honeypotId: string): string {
    return this.activeHoneypots.get(honeypotId)?.status || 'stopped';
  }

  /**
   * Shuts down all honeypots cleanly.
   */
  public async shutdownAll() {
    const promises = Array.from(this.activeHoneypots.keys()).map((id) => this.stop(id));
    await Promise.all(promises);
  }
}

export const runtimeManager = new HoneypotRuntimeManager();
