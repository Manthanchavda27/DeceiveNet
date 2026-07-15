/*
  Warnings:

  - The required column `api_key` was added to the `Honeypot` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Honeypot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "api_key" TEXT NOT NULL,
    "bind_address" TEXT,
    "port" INTEGER,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "deployed_at" DATETIME,
    "last_active_at" DATETIME,
    "container_id" TEXT,
    "metadata" JSONB,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Honeypot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Honeypot" ("bind_address", "config", "container_id", "deployed_at", "id", "last_active_at", "metadata", "name", "port", "status", "tags", "type", "user_id") SELECT "bind_address", "config", "container_id", "deployed_at", "id", "last_active_at", "metadata", "name", "port", "status", "tags", "type", "user_id" FROM "Honeypot";
DROP TABLE "Honeypot";
ALTER TABLE "new_Honeypot" RENAME TO "Honeypot";
CREATE UNIQUE INDEX "Honeypot_api_key_key" ON "Honeypot"("api_key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
