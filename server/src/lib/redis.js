import { createClient } from "redis";
import env from "../config/env.js";
import logger from "../config/logger.js";

const globalForRedis = globalThis;

const redis =
  globalForRedis.redis ??
  createClient({
    url: env.REDIS_URL,
  });

// Event Listeners
redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("ready", () => {
  logger.info("Redis connected");
});

redis.on("error", (error) => {
  logger.error({ error }, "Redis error");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("end", () => {
  logger.warn("Redis connection closed");
});

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export default redis;