// import the express application and type definition
import express, { Express } from "express";
import morgan from "morgan";

import { HTTP_STATUS } from "./constants/httpConstants";
import v1Router from "./api/v1";
import { errorHandler } from "./middleware/errorHandler";

// initialize the express application
const app: Express = express();

// Interface for health check response
// An interface in TypeScript defines the structure or "shape" of an object.
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

// Middleware START
app.use(morgan("combined"));

// Ensures incoming body is correctly parsed to JSON, otherwise req.body would be undefined
app.use(express.json());
// Middleware END

// respond to GET request at endpoint "/" with message
app.get("/", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ message: "Hello World" });
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (_req, res) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.status(HTTP_STATUS.OK).json(healthData);
});

// Route Imports START
// "/api/v1" will prefix all v1 routes (ex: /api/v1/tickets)
app.use("/api/v1", v1Router);
// Route Imports END

// Global error handler LAST
app.use(errorHandler);

export default app;
