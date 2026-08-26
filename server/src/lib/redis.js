import IORedis from "ioredis";

import env from "../config/env.js";
import logger from "../config/logger.js";

const globalForRedis = globalThis;

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,

  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,

  // Upstash Redis uses TLS
  tls: {},

  // Required for BullMQ-compatible Redis usage
  maxRetriesPerRequest: null,

  enableReadyCheck: true,

  retryStrategy(times) {
    const delay = Math.min(times * 500, 5000);

    logger.warn(
      {
        attempt: times,
        delay,
      },
      "Redis reconnecting..."
    );

    return delay;
  },
};

const redis =
  globalForRedis.redis ??
  new IORedis(redisOptions);

redis.on("connect", () => {
  logger.info("Redis TCP connection established");
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("error", (error) => {
  logger.error(
    {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    },
    "Redis error"
  );
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export default redis;