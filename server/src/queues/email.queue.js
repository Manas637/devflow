import { Queue } from "bullmq";
import IORedis from "ioredis";

import env from "../config/env.js";

const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,

  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,

  // Upstash Redis uses TLS
  tls: {},

  // Required by BullMQ
  maxRetriesPerRequest: null,

  enableReadyCheck: true,
});

export const EMAIL_QUEUE_NAME = "email";

export const emailQueue = new Queue(
  EMAIL_QUEUE_NAME,
  {
    connection,

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: {
        age: 60 * 60,
        count: 1000,
      },

      removeOnFail: {
        age: 24 * 60 * 60,
      },
    },
  }
);

export default emailQueue;