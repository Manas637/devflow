import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import env from "./config/env.js";

import routes from "./routes/index.js"
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Compression
app.use(compression());

app.use(requestLogger);

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

app.use("/api/v1",routes)

app.use(notFound);

app.use(errorHandler);

export default app;