import app from "./app.js";

import env from "./config/env.js";
import logger from "./config/logger.js";

import prisma from "./lib/prisma.js";
import redis from "./lib/redis.js";

let server;
let isShuttingDown = false;

async function startServer() {
  try {
    // PostgreSQL
    await prisma.$connect();
    logger.info("PostgreSQL connected");

    // Redis
    if (!redis.isOpen) {
      await redis.connect();
    }

    logger.info("Redis connected");

    // HTTP server
    server = app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    logger.fatal(
      { err: error },
      "Failed to start server"
    );

    await shutdown("STARTUP_FAILURE");
    process.exit(1);
  }
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    `${signal} received. Shutting down gracefully...`
  );

  try {
    // Close HTTP server only if it is actually running
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
    if (redis.isOpen) {
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
    process.exit(0);
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

  await shutdown("unhandledRejection");
});

process.on("uncaughtException", async (error) => {
  logger.fatal(
    {
      err: error,
    },
    "Uncaught Exception"
  );

  await shutdown("uncaughtException");
});