import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";

/**
 * Winston Logger Configuration
 *
 * Structured logging with daily rotation and 14-day retention
 */

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const contextStr = context ? `[${context}]` : "";
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}`;
  }),
);

// Custom format for file output (JSON)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Filter out sensitive data
const sanitizeMetadata = winston.format((info) => {
  if (info.metadata) {
    // Remove sensitive fields
    const sensitiveFields = [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
    ];
    sensitiveFields.forEach((field) => {
      if (info.metadata[field]) {
        info.metadata[field] = "[REDACTED]";
      }
    });
  }

  // Sanitize stack traces (remove absolute paths)
  if (typeof info.stack === "string") {
    info.stack = info.stack.replace(/\/home\/[^\s]+\//g, "");
  }

  return info;
});

// Logs directory
const logsDir = path.join(process.cwd(), "logs");

/**
 * Daily rotate file transport for error logs
 */
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "14d", // Keep for 14 days
  maxSize: "20m", // Rotate if file exceeds 20MB
  format: fileFormat,
  zippedArchive: true, // Compress old logs
});

/**
 * Daily rotate file transport for warning logs
 */
const warnFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "warn-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "warn",
  maxFiles: "14d",
  maxSize: "20m",
  format: fileFormat,
  zippedArchive: true,
});

/**
 * Daily rotate file transport for combined logs
 */
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  format: fileFormat,
  zippedArchive: true,
});

/**
 * Console transport (only in development)
 */
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

/**
 * Winston logger configuration
 */
export const winstonConfig: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(sanitizeMetadata(), fileFormat),
  transports: [
    combinedFileTransport,
    errorFileTransport,
    warnFileTransport,
    consoleTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "20m",
      format: fileFormat,
      zippedArchive: true,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "20m",
      format: fileFormat,
      zippedArchive: true,
    }),
  ],
};

/**
 * Create Winston logger instance
 */
export const createLogger = (): winston.Logger => {
  const logger = winston.createLogger(winstonConfig);

  // Log initialization
  if (process.env.NODE_ENV !== "test") {
    logger.info("Winston logger initialized", {
      context: "WinstonConfig",
      environment: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL || "info",
    });
  }

  return logger;
};

/**
 * Helper function to log with context
 */
export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.logger = createLogger();
    this.context = context;
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.logger.error(message, {
      context: this.context,
      error: error
        ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
        : undefined,
      ...metadata,
    });
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.logger.warn(message, {
      context: this.context,
      ...metadata,
    });
  }

  info(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, {
      context: this.context,
      ...metadata,
    });
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.logger.debug(message, {
      context: this.context,
      ...metadata,
    });
  }

  log(level: string, message: string, metadata?: Record<string, any>) {
    this.logger.log(level, message, {
      context: this.context,
      ...metadata,
    });
  }
}

export default winstonConfig;
