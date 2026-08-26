import { Worker } from "bullmq";
import IORedis from "ioredis";

import env from "../config/env.js";
import mailService from "../services/mail/mail.service.js";
import logger from "../config/logger.js";

import { EMAIL_QUEUE_NAME } from "../queues/email.queue.js";

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

  retryStrategy(times) {
    const delay = Math.min(times * 500, 5000);

    logger.warn(
      {
        attempt: times,
        delay,
      },
      "Worker Redis reconnecting..."
    );

    return delay;
  },
});

connection.on("connect", () => {
  logger.info("Worker Redis TCP connection established");
});

connection.on("ready", () => {
  logger.info("Worker Redis ready");
});

connection.on("error", (error) => {
  logger.error(
    {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    },
    "Worker Redis error"
  );
});

connection.on("reconnecting", () => {
  logger.warn("Worker Redis reconnecting...");
});

connection.on("close", () => {
  logger.warn("Worker Redis connection closed");
});

const worker = new Worker(
  EMAIL_QUEUE_NAME,

  async (job) => {
    switch (job.name) {
      case "verification-email": {
        await mailService.sendVerificationEmail({
          user: {
            name: job.data.name,
            email: job.data.to,
          },
          token: job.data.token,
        });

        break;
      }

      case "password-reset-email": {
        await mailService.sendPasswordResetEmail({
          user: {
            name: job.data.name,
            email: job.data.to,
          },
          token: job.data.token,
        });

        break;
      }

      case "organization-invitation-email": {
        await mailService.sendOrganizationInvitationEmail({
          email: job.data.to,
          name: job.data.name,
          organizationName: job.data.organizationName,
          role: job.data.role,
          token: job.data.token,
        });

        break;
      }

      default:
        throw new Error(
          `Unknown email job: ${job.name}`
        );
    }
  },

  {
    connection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  logger.info(
    {
      jobId: job.id,
      jobName: job.name,
    },
    "Email job completed."
  );
});

worker.on("failed", (job, error) => {
  logger.error(
    {
      jobId: job?.id,
      jobName: job?.name,
      error: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
      },
    },
    "Email job failed."
  );
});

worker.on("error", (error) => {
  logger.error(
    {
      name: error?.name,
      message: error?.message,
      code: error?.code,
    },
    "Email worker error."
  );
});

logger.info("Email worker started.");

export default worker;