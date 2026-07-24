-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "lockout_until" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "allowed_ips" JSONB,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Honeypot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "api_key" TEXT NOT NULL,
    "bind_address" TEXT,
    "port" INTEGER,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "deployed_at" TIMESTAMP(3),
    "last_active_at" TIMESTAMP(3),
    "container_id" TEXT,
    "metadata" JSONB,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Honeypot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecoyService" (
    "id" TEXT NOT NULL,
    "honeypot_id" TEXT,
    "name" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "banner" TEXT,
    "credentials" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecoyService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecoySession" (
    "id" TEXT NOT NULL,
    "decoy_service_id" TEXT NOT NULL,
    "attacker_ip" TEXT NOT NULL,
    "source_port" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "last_active_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "commands_executed" INTEGER NOT NULL DEFAULT 0,
    "data_transferred" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "DecoySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "event_uuid" TEXT NOT NULL,
    "honeypot_id" TEXT,
    "decoy_service_id" TEXT,
    "decoy_session_id" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,
    "severity_score" INTEGER,
    "attack_type" TEXT NOT NULL,
    "source_ip" TEXT NOT NULL,
    "source_port" INTEGER,
    "source_geo" JSONB,
    "target_port" INTEGER,
    "protocol" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "payload_id" TEXT,
    "raw_data" JSONB,
    "enriched_data" JSONB,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "assigned_to" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventComment" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payload" (
    "id" TEXT NOT NULL,
    "payload_uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "raw" BYTEA,
    "text_content" TEXT,
    "size_bytes" BIGINT NOT NULL,
    "md5" TEXT NOT NULL,
    "sha1" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "entropy" DOUBLE PRECISION NOT NULL,
    "mime_type" TEXT,
    "language_detected" TEXT,
    "decoded_text" TEXT,
    "honeypot_id" TEXT,
    "source_ip" TEXT NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL,
    "analysis" JSONB,

    CONSTRAINT "Payload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "frequency_count" INTEGER NOT NULL,
    "frequency_window_minutes" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "notification_channels" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_triggered_at" TIMESTAMP(3),

    CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertHistory" (
    "id" TEXT NOT NULL,
    "alert_rule_id" TEXT NOT NULL,
    "triggered_at" TIMESTAMP(3) NOT NULL,
    "event_ids" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unacknowledged',
    "acknowledged_by" TEXT,
    "acknowledged_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "AlertHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events_subscribed" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "retry_count" INTEGER NOT NULL DEFAULT 3,
    "timeout_seconds" INTEGER NOT NULL DEFAULT 30,
    "headers" JSONB,
    "rate_limit_per_minute" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDeliveryLog" (
    "id" TEXT NOT NULL,
    "webhook_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "request_body" JSONB NOT NULL,
    "response_status" INTEGER,
    "response_body" TEXT,
    "error_message" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL,
    "success" BOOLEAN NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "duration_ms" INTEGER,

    CONSTRAINT "WebhookDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatIndicator" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "first_seen" TIMESTAMP(3) NOT NULL,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "source" TEXT NOT NULL,
    "source_event_id" TEXT,
    "threat_actor_id" TEXT,
    "enrichment_data" JSONB,
    "notes" TEXT,

    CONSTRAINT "ThreatIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatActor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "first_seen" TIMESTAMP(3) NOT NULL,
    "last_seen" TIMESTAMP(3) NOT NULL,
    "attack_count" INTEGER NOT NULL DEFAULT 0,
    "primary_attack_types" TEXT NOT NULL,
    "common_ips" TEXT NOT NULL,
    "targeted_services" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "profile_data" JSONB,
    "notes" TEXT,

    CONSTRAINT "ThreatActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "username" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamper_hash" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WsSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ws_connection_id" TEXT NOT NULL,
    "connected_at" TIMESTAMP(3) NOT NULL,
    "last_heartbeat" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "WsSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "search_config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "channel" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_idx" ON "RefreshToken"("user_id");

-- CreateIndex
CREATE INDEX "ApiKey_key_hash_idx" ON "ApiKey"("key_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Honeypot_api_key_key" ON "Honeypot"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "DecoySession_session_id_key" ON "DecoySession"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_event_uuid_key" ON "Event"("event_uuid");

-- CreateIndex
CREATE INDEX "Event_timestamp_idx" ON "Event"("timestamp");

-- CreateIndex
CREATE INDEX "Event_honeypot_id_idx" ON "Event"("honeypot_id");

-- CreateIndex
CREATE INDEX "Event_severity_idx" ON "Event"("severity");

-- CreateIndex
CREATE INDEX "Event_attack_type_idx" ON "Event"("attack_type");

-- CreateIndex
CREATE INDEX "Event_source_ip_idx" ON "Event"("source_ip");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payload_payload_uuid_key" ON "Payload"("payload_uuid");

-- CreateIndex
CREATE INDEX "Payload_sha256_idx" ON "Payload"("sha256");

-- CreateIndex
CREATE INDEX "Payload_md5_idx" ON "Payload"("md5");

-- CreateIndex
CREATE INDEX "Payload_captured_at_idx" ON "Payload"("captured_at");

-- CreateIndex
CREATE INDEX "WebhookDeliveryLog_webhook_id_idx" ON "WebhookDeliveryLog"("webhook_id");

-- CreateIndex
CREATE INDEX "WebhookDeliveryLog_attempted_at_idx" ON "WebhookDeliveryLog"("attempted_at");

-- CreateIndex
CREATE INDEX "ThreatIndicator_last_seen_idx" ON "ThreatIndicator"("last_seen");

-- CreateIndex
CREATE UNIQUE INDEX "ThreatIndicator_value_type_key" ON "ThreatIndicator"("value", "type");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_user_id_idx" ON "AuditLog"("user_id");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "WsSession_ws_connection_id_key" ON "WsSession"("ws_connection_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Honeypot" ADD CONSTRAINT "Honeypot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecoyService" ADD CONSTRAINT "DecoyService_honeypot_id_fkey" FOREIGN KEY ("honeypot_id") REFERENCES "Honeypot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecoySession" ADD CONSTRAINT "DecoySession_decoy_service_id_fkey" FOREIGN KEY ("decoy_service_id") REFERENCES "DecoyService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_honeypot_id_fkey" FOREIGN KEY ("honeypot_id") REFERENCES "Honeypot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_decoy_service_id_fkey" FOREIGN KEY ("decoy_service_id") REFERENCES "DecoyService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_decoy_session_id_fkey" FOREIGN KEY ("decoy_session_id") REFERENCES "DecoySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_payload_id_fkey" FOREIGN KEY ("payload_id") REFERENCES "Payload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventComment" ADD CONSTRAINT "EventComment_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventComment" ADD CONSTRAINT "EventComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payload" ADD CONSTRAINT "Payload_honeypot_id_fkey" FOREIGN KEY ("honeypot_id") REFERENCES "Honeypot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertRule" ADD CONSTRAINT "AlertRule_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertHistory" ADD CONSTRAINT "AlertHistory_alert_rule_id_fkey" FOREIGN KEY ("alert_rule_id") REFERENCES "AlertRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDeliveryLog" ADD CONSTRAINT "WebhookDeliveryLog_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreatIndicator" ADD CONSTRAINT "ThreatIndicator_threat_actor_id_fkey" FOREIGN KEY ("threat_actor_id") REFERENCES "ThreatActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WsSession" ADD CONSTRAINT "WsSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
