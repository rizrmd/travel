import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bullmq";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";

// Entities
import { OAuthClientEntity } from "./infrastructure/persistence/relational/entities/oauth-client.entity";
import { AccessTokenEntity } from "./infrastructure/persistence/relational/entities/access-token.entity";
import { ApiKeyEntity } from "./infrastructure/persistence/relational/entities/api-key.entity";
import { WebhookSubscriptionEntity } from "./infrastructure/persistence/relational/entities/webhook-subscription.entity";
import { WebhookDeliveryEntity } from "./infrastructure/persistence/relational/entities/webhook-delivery.entity";
import { ApiRequestLogEntity } from "./infrastructure/persistence/relational/entities/api-request-log.entity";

// Services
import { OAuthService } from "./services/oauth.service";
import { ApiKeyService } from "./services/api-key.service";
import { WebhookSubscriptionService } from "./services/webhook-subscription.service";
import { WebhookDeliveryService } from "./services/webhook-delivery.service";
import { RateLimiterService } from "./services/rate-limiter.service";
import { PublicApiService } from "./services/public-api.service";
import { DeveloperPortalService } from "./services/developer-portal.service";
import { SandboxService } from "./services/sandbox.service";
import { ApiAnalyticsService } from "./services/api-analytics.service";
import { ApiChangelogService } from "./services/api-changelog.service";

// Controllers
import { OAuthController } from "./controllers/oauth.controller";
import { ApiKeysController } from "./controllers/api-keys.controller";
import { WebhooksController } from "./controllers/webhooks.controller";
import { PublicApiController } from "./controllers/public-api.controller";
import { DeveloperPortalController } from "./controllers/developer-portal.controller";

// Guards
import { OAuthGuard } from "./guards/oauth.guard";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { RateLimitGuard } from "./guards/rate-limit.guard";
import { WebhookSignatureGuard } from "./guards/webhook-signature.guard";

// Background Jobs
import { WebhookDeliveryProcessor } from "./jobs/webhook-delivery.processor";
import { TokenCleanupProcessor } from "./jobs/token-cleanup.processor";
import { ApiLogAggregationProcessor } from "./jobs/api-log-aggregation.processor";

// Import other modules
import { JamaahModule } from "../jamaah/jamaah.module";
import { PaymentsModule } from "../payments/payments.module";
import { PackagesModule } from "../packages/packages.module";
import { DocumentsModule } from "../documents/documents.module";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";

// Import entities from other modules for Public API
import { JamaahEntity } from "../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { PaymentEntity } from "../payments/infrastructure/persistence/relational/entities/payment.entity";
import { PackageEntity } from "../packages/infrastructure/persistence/relational/entities/package.entity";
import { DocumentEntity } from "../documents/infrastructure/persistence/relational/entities/document.entity";
import { UserEntity } from "../users/entities/user.entity";

@Module({
  imports: [
    // TypeORM entities
    TypeOrmModule.forFeature([
      // API Platform entities
      OAuthClientEntity,
      AccessTokenEntity,
      ApiKeyEntity,
      WebhookSubscriptionEntity,
      WebhookDeliveryEntity,
      ApiRequestLogEntity,
      // Entities for Public API
      JamaahEntity,
      PaymentEntity,
      PackageEntity,
      DocumentEntity,
      UserEntity,
    ]),

    // Bull queue for webhook delivery
    BullModule.registerQueue({
      name: "webhook-delivery",
    }),

    // Cache module for rate limiting
    CacheModule.register(),

    // Schedule module for background jobs
    ScheduleModule.forRoot(),

    // Import other modules
    JamaahModule,
    PaymentsModule,
    PackagesModule,
    DocumentsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    OAuthController,
    ApiKeysController,
    WebhooksController,
    PublicApiController,
    DeveloperPortalController,
  ],
  providers: [
    // Services
    OAuthService,
    ApiKeyService,
    WebhookSubscriptionService,
    WebhookDeliveryService,
    RateLimiterService,
    PublicApiService,
    DeveloperPortalService,
    SandboxService,
    ApiAnalyticsService,
    ApiChangelogService,

    // Guards
    OAuthGuard,
    ApiKeyGuard,
    RateLimitGuard,
    WebhookSignatureGuard,

    // Background Jobs
    WebhookDeliveryProcessor,
    TokenCleanupProcessor,
    ApiLogAggregationProcessor,
  ],
  exports: [
    // Export services for use in other modules
    OAuthService,
    ApiKeyService,
    WebhookSubscriptionService,
    WebhookDeliveryService,
    RateLimiterService,
    PublicApiService,
    ApiAnalyticsService,
    ApiChangelogService,

    // Export guards
    OAuthGuard,
    ApiKeyGuard,
    RateLimitGuard,
    WebhookSignatureGuard,
  ],
})
export class ApiPlatformModule { }
