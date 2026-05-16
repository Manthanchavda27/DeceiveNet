export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Deployed' | 'Draft';
  updatedAgo: string;
  icon: string;
}

export interface Honeypot {
  id: string;
  name: string;
  type: 'SSH' | 'HTTP' | 'MySQL' | 'FTP' | 'DNS' | 'Custom';
  status: 'Active' | 'Inactive' | 'Error';
  ip: string;
  port: number;
  deployed: string;
  attacksCaptured: number;
  tags: string[];
  uptime?: string;
  uniqueAttackers?: number;
  currentConnections?: number;
}

export interface AttackEvent {
  id: string;
  timestamp: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  attackType: string;
  sourceIP: string;
  sourcePort: number;
  targetHoneypot: string;
  targetService: string;
  status: 'New' | 'In Progress' | 'Reviewed' | 'False Positive' | 'Escalated';
  payload: string;
  country?: string;
  countryCode?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  channels: string[];
  enabled: boolean;
  lastTriggered: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  lastDelivery: string;
  lastStatus: 'success' | 'failure' | 'pending';
}

export interface ThreatIndicator {
  id: string;
  value: string;
  type: 'IP' | 'Domain' | 'URL' | 'MD5' | 'SHA256' | 'Email';
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  source: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: 'Create' | 'Read' | 'Update' | 'Delete' | 'Export' | 'Login' | 'Config Change';
  resourceType: string;
  resourceName: string;
  details: string;
  ipAddress: string;
}

export interface Session {
  id: string;
  ip: string;
  type: 'AI Agent' | 'Human' | 'Bot';
  confidence: number;
  duration: string;
  pagesVisited: number;
  filesExfiltrated: number;
  firstSeen: string;
  lastSeen: string;
  responseTime: number;
  country: string;
  flag: string;
  headers: Record<string, string>;
  timeline: { page: string; timestamp: string; responseTime: number }[];
  promptInjectionsTriggered: string[];
}
