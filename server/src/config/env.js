import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().int().positive(),

  CLIENT_URL: z.url(),

  DATABASE_URL: z.url(),

  REDIS_URL: z.url(),

  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  LOG_LEVEL: z.enum([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
  ]),

  PRISMA_LOG_QUERIES: z.coerce.boolean(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().positive(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(), 

  MAIL_FROM: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsed.error.format());
  process.exit(1);
}

const env = Object.freeze(parsed.data);

export default env;