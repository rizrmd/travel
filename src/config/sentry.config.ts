import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

/**
 * Sentry Configuration
 *
 * Error tracking and performance monitoring configuration
 */
export const sentryConfig = {
  dsn: process.env.SENTRY_DSN || "",
  environment: process.env.NODE_ENV || "development",

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0, // 10% sampling in production
  profilesSampleRate: 0.1, // Profile 10% of sampled transactions

  // Integrations
  integrations: [nodeProfilingIntegration()],

  // Release tracking
  release: process.env.npm_package_version || "1.0.0",

  // Before send hook - filter sensitive data
  beforeSend(event, hint) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
      delete event.request.headers["x-api-key"];
    }

    // Remove sensitive data from context
    if (event.contexts) {
      if (event.contexts.user) {
        delete (event.contexts.user as any).password;
        delete (event.contexts.user as any).token;
      }
    }

    // Filter out non-error logs in production
    if (process.env.NODE_ENV === "production" && event.level === "info") {
      return null;
    }

    return event;
  },

  // Breadcrumb filtering
  beforeBreadcrumb(breadcrumb, hint) {
    // Filter sensitive URLs
    if (breadcrumb.category === "http" && breadcrumb.data?.url) {
      const url = new URL(breadcrumb.data.url);
      if (url.searchParams.has("token") || url.searchParams.has("password")) {
        return null;
      }
    }

    return breadcrumb;
  },

  // Error filtering
  ignoreErrors: [
    // Browser errors
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    // Network errors
    "Network request failed",
    "NetworkError",
    // Common non-critical errors
    "AbortError",
    "cancelled",
  ],

  // Tags
  initialScope: {
    tags: {
      service: "travel-umroh-api",
      platform: "backend",
    },
  },
};

/**
 * Initialize Sentry
 */
export function initializeSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn("⚠️  Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init(sentryConfig);
  console.log("✅ Sentry initialized");
}

/**
 * Capture exception with context
 */
export function captureException(
  error: Error,
  context?: {
    tenantId?: string;
    userId?: string;
    feature?: string;
    metadata?: Record<string, any>;
  },
) {
  Sentry.captureException(error, {
    tags: {
      tenant_id: context?.tenantId,
      feature: context?.feature,
    },
    user: context?.userId ? { id: context.userId } : undefined,
    extra: context?.metadata,
  });
}

export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info" as any,
  context?: Record<string, any>,
) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Set user context
 */
export function setUserContext(
  userId: string,
  email?: string,
  tenantId?: string,
) {
  Sentry.setUser({
    id: userId,
    email,
    tenant_id: tenantId,
  });
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, any>,
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: "info",
  });
}

export const sentryErrorHandler = Sentry.setupExpressErrorHandler;

// Note: Handlers.requestHandler is deprecated/removed in v8+ in favor of setupExpressErrorHandler

export default Sentry;
