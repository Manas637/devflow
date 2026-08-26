import "./workers/email.worker.js"
import app from "./app.js";

import env from "./config/env.js";
import logger from "./config/logger.js";

import prisma from "./lib/prisma.js";
import redis from "./lib/redis.js";

let server;
let isShuttingDown = false;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL connected");

    await redis.ping();
    logger.info("Redis health check passed");

    server = app.listen(env.PORT, "0.0.0.0", () => {
      logger.info(`Server started on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal(
      {
        err: error,
      },
      "Failed to start server"
    );

    await shutdown("STARTUP_FAILURE");
  }
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(`${signal} received. Shutting down gracefully...`);

  try {
    // Stop accepting new HTTP requests
    if (server?.listening) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });

      logger.info("HTTP server closed");
    }

    // PostgreSQL
    await prisma.$disconnect();
    logger.info("PostgreSQL disconnected");

    // Redis
    if (redis.status !== "end") {
      await redis.quit();
      logger.info("Redis disconnected");
    }

    logger.info("Application shutdown complete");
  } catch (error) {
    logger.fatal(
      {
        err: error,
      },
      "Error during shutdown"
    );
  } finally {
    process.exit(signal === "STARTUP_FAILURE" ? 1 : 0);
  }
}

await startServer();

process.once("SIGINT", () => {
  shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("unhandledRejection", async (reason) => {
  logger.fatal(
    {
      reason,
    },
    "Unhandled Promise Rejection"
  );

  await shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", async (error) => {
  logger.fatal(
    {
      err: error,
    },
    "Uncaught Exception"
  );

  await shutdown("UNCAUGHT_EXCEPTION");
});