import { Queue } from "bullmq";

import env from "../config/env.js";
import IORedis from "ioredis";

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
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