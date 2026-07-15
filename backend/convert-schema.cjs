const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace provider
schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
// Replace url
schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/g, 'url = "file:./dev.db"');

// Remove @db.Uuid
schema = schema.replace(/@db\.Uuid/g, '');
// Remove @db.Char(x)
schema = schema.replace(/@db\.Char\(\d+\)/g, '');

// Convert String[] to String
schema = schema.replace(/String\[\]/g, 'String');

// Convert Json to String for SQLite compatibility (optional, but safe)
// Actually Prisma on SQLite does not support Json, but let's try leaving it first, or replace it with String.
// We'll replace Json with String to be safe.
// schema = schema.replace(/Json\?/g, 'String?');
// schema = schema.replace(/Json/g, 'String');

// Enums to String
const enums = [
  'UserRole', 'UserStatus', 'HoneypotType', 'HoneypotStatus', 
  'DecoySessionStatus', 'EventSeverity', 'AttackType', 
  'EventRecordStatus', 'AlertHistoryStatus', 'PayloadType', 
  'ThreatIndicatorType', 'ActorConfidence', 'AuditAction', 
  'NotificationChannel', 'NotificationLogStatus'
];

enums.forEach(e => {
  // Replace enum usages with String
  const regex = new RegExp(`\\b${e}\\b`, 'g');
  schema = schema.replace(regex, 'String');
});

// Remove the actual enum blocks
schema = schema.replace(/enum \w+ \{[^}]+\}/g, '');

// Fix defaults
schema = schema.replace(/@default\(\[\]\)/g, '@default("[]")');
schema = schema.replace(/@default\(active\)/g, '@default("active")');
schema = schema.replace(/@default\(new\)/g, '@default("new")');
schema = schema.replace(/@default\(unacknowledged\)/g, '@default("unacknowledged")');
schema = schema.replace(/@default\("\[\]"\)/g, '@default("[]")'); // if it became double

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated for SQLite.');
