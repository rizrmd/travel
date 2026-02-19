/**
 * Epic 8, Story 8.4: BullMQ Configuration
 * Centralized configuration for BullMQ queues
 */

import { ConfigService } from "@nestjs/config";

/**
 * BullMQ connection configuration
 */
export const getBullConfig = (configService: ConfigService) => ({
  connection: {
    host: configService.get("REDIS_HOST", "localhost"),
    port: configService.get<number>("REDIS_PORT", 6379),
    password: configService.get("REDIS_PASSWORD"),
    db: configService.get<number>("REDIS_DB", 0),
    // Connection retry strategy
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // Enable keepalive
    keepAlive: 30000,
  },
  // Default job options
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential" as const,
      delay: 5000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
      count: 500, // Keep last 500 failed jobs
    },
  },
});

/**
 * Queue-specific configurations
 */
export const queueConfigs = {
  email: {
    limiter: {
      max: 100, // Max 100 jobs
      duration: 60000, // per minute (rate limiting)
    },
  },
  notifications: {
    limiter: {
      max: 200, // Max 200 notifications
      duration: 60000, // per minute
    },
  },
  "batch-processing": {
    limiter: {
      max: 10, // Max 10 batch jobs
      duration: 60000, // per minute (resource intensive)
    },
  },
  reports: {
    limiter: {
      max: 20, // Max 20 reports
      duration: 60000, // per minute
    },
  },
};

/**
 * Job priority levels
 */
export enum JobPriority {
  CRITICAL = 1, // Highest priority
  HIGH = 5,
  NORMAL = 10,
  LOW = 15,
  BACKGROUND = 20, // Lowest priority
}

/**
 * Job retry strategies
 */
export const retryStrategies = {
  email: {
    attempts: 3,
    backoff: {
      type: "exponential" as const,
      delay: 5000, // 5s, 10s, 20s
    },
  },
  notifications: {
    attempts: 5,
    backoff: {
      type: "exponential" as const,
      delay: 3000, // 3s, 6s, 12s, 24s, 48s
    },
  },
  batchProcessing: {
    attempts: 2,
    backoff: {
      type: "fixed" as const,
      delay: 10000, // 10s fixed delay
    },
  },
  reports: {
    attempts: 5,
    backoff: {
      type: "exponential" as const,
      delay: 10000, // 10s, 20s, 40s, 80s, 160s
    },
  },
};
