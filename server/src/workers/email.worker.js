import { Worker } from "bullmq";

import IORedis from "ioredis";

import env from "../config/env.js";

import mailService from "../services/mail/mail.service.js";

import logger from "../config/logger.js";

import {
  EMAIL_QUEUE_NAME,
} from "../queues/email.queue.js";

const connection = new IORedis(
  env.REDIS_URL,
  {
    maxRetriesPerRequest: null,
  }
);

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
          logger.info(
            {
              to: job.data.to,
              name: job.data.name,
              organizationName: job.data.organizationName,
              role: job.data.role,
              hasToken: Boolean(job.data.token),
            },
            "Processing organization invitation email."
          );

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
        throw new Error(`Unknown email job: ${job.name}`);
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
        command: error?.command,
        response: error?.response,
        responseCode: error?.responseCode,
        stack: error?.stack,
      },
    },
    "Email job failed."
  );
});

worker.on("error", (error) => {
  logger.error(
    { error },
    "Email worker error."
  );
});

logger.info(
  "Email worker started."
);

export default worker;