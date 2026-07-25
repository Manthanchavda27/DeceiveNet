import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { broadcastEvent } from '../index.js';

const router = Router();

// Validate SDK payloads and ingest events
router.post('/events', async (req: Request, res: Response) => {
  try {
    const { projectId, events } = req.body;
    const signature = req.headers['x-deceivenet-signature'] as string;
    const timestampStr = req.headers['x-deceivenet-timestamp'] as string;

    if (!projectId || !events || !Array.isArray(events) || !signature || !timestampStr) {
      return res.status(400).json({ error: 'Invalid payload or missing headers' });
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Replay protection: Reject timestamps older than 5 minutes or in the future
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
      return res.status(403).json({ error: 'Timestamp invalid or expired' });
    }

    // Find the honeypot (project) to get the API Key
    const hp = await prisma.honeypot.findUnique({
      where: { id: projectId },
      select: { id: true, apiKey: true, userId: true, name: true }
    });

    if (!hp) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify HMAC — must match SDK's JSON.stringify(payload) without key sorting
    const payloadStr = JSON.stringify({ projectId, events });
    const hmac = crypto.createHmac('sha256', hp.apiKey);
    hmac.update(`${timestampStr}.${payloadStr}`);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      console.error(`[SDK AUTH] Invalid signature for project ${projectId}`);
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // Process and save events
    const savedEvents = [];
    for (const ev of events) {
      const event = await prisma.event.create({
        data: {
          eventUuid: uuidv4(),
          honeypotId: hp.id,
          timestamp: new Date(ev.timestamp || Date.now()),
          severity: ev.severity || 'low',
          severityScore: ev.severity === 'critical' ? 9 : ev.severity === 'high' ? 7 : ev.severity === 'medium' ? 5 : 1,
          attackType: ev.attackType || 'probe',
          sourceIp: ev.sourceIp || 'unknown',
          protocol: ev.protocol || 'HTTP',
          rawData: ev.rawData || {},
        }
      });
      savedEvents.push(event);

      // Broadcast telemetry ONLY to the owner via WebSocket
      broadcastEvent(hp.userId, {
        id: event.id,
        honeypotId: event.honeypotId,
        honeypotName: hp.name,
        attackType: event.attackType,
        severity: event.severity,
        sourceIp: event.sourceIp,
        timestamp: event.timestamp,
      });
    }

    res.status(202).json({ success: true, ingested: savedEvents.length });

  } catch (e: any) {
    console.error('[SDK Ingestion Error]', e?.message || e);
    // Return 500 so SDK will retry later
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const sdkRouter = router;
