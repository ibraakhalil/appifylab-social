import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? "./data/appifylab-social.db";
const resolvedDatabasePath = resolve(process.cwd(), databaseUrl);

mkdirSync(dirname(resolvedDatabasePath), { recursive: true });

const jwtSecret =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === "production" ? "" : "change-me-in-production");

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required in production.");
}

export const env = {
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: resolvedDatabasePath,
  jwtSecret,
  port: Number(process.env.PORT ?? 3001),
};
