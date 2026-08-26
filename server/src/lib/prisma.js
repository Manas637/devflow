import { PrismaClient } from "@prisma/client";
import env from "../config/env.js";
import logger from "../config/logger.js";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
      ...(env.PRISMA_LOG_QUERIES
        ? [{ emit: "event", level: "query" }]
        : []),
    ],
  });

// Prisma logging
prisma.$on("error", (event) => {
  logger.error({ event }, "Prisma Error");
});

prisma.$on("warn", (event) => {
  logger.warn({ event }, "Prisma Warning");
});

if (env.PRISMA_LOG_QUERIES) {
  prisma.$on("query", (event) => {
    logger.debug(
      {
        query: event.query,
        params: event.params,
        duration: `${event.duration}ms`,
      },
      "Prisma Query"
    );
  });
}

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;