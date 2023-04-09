import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const logsDirPath = path.join(__dirname, "..", "logs");
// Create the logs directory if it doesn't exist
if (!fs.existsSync(logsDirPath)) {
  fs.mkdirSync(logsDirPath);
}

// Set up morgan logger middleware
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "..", "logs", "access.log"),
  { flags: "a" }
);

export const accessLogger = morgan("combined", { stream: accessLogStream });

// Error handler middleware
const errorLogStream = fs.createWriteStream(
  path.join(__dirname, "..", "logs", "error.log"),
  {
    flags: "a",
  }
);

interface CustomError extends Error {
  status?: number;
}

export const errorLogger = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get current date and time
  const date = new Date();
  const timestamp = date.toISOString();

  // Get file location where error occurred
  const fileLocation = err.stack.split("\n")[1].trim();

  // Log error to file
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const log = `[${timestamp}] [${req.method} ${req.url} ${status}] ${message} [${fileLocation}]\n`;
  errorLogStream.write(log);

  // Send error response to client
  res.status(status).json({ message });
};
