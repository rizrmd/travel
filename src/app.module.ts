import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "./roles/roles.module";
import { WhatsAppModule } from "./whatsapp/whatsapp.module";
import { ChatbotModule } from "./chatbot/chatbot.module";
import { LandingPagesModule } from "./landing-pages/landing-pages.module";
import { LeadsModule } from "./leads/leads.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { PaymentsModule } from "./payments/payments.module";
import { WebSocketModule } from "./websocket/websocket.module";
import { QueueModule } from "./queue/queue.module";
import { CacheModule } from "./cache/cache.module";
import { RlsSessionMiddleware } from "./roles/middleware/rls-session.middleware";
import { TenantsModule } from "./tenants/tenants.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TenantMiddleware } from "./tenants/middleware/tenant.middleware";
import { PackagesModule } from "./packages/packages.module";
import { JamaahModule } from "./jamaah/jamaah.module";
import { DocumentsModule } from "./documents/documents.module";
import { OcrModule } from "./ocr/ocr.module";
import { ComplianceModule } from "./compliance/compliance.module";
import { SiskopatuhModule } from "./siskopatuh/siskopatuh.module";
import { ESignatureModule } from "./esignature/esignature.module";
import { TenantEntity } from "./tenants/entities/tenant.entity";

const typeOrmDatabaseConfig = process.env.DATABASE_URL
  ? {
    url: process.env.DATABASE_URL,
  }
  : {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || "travel_umroh",
  };

/**
 * Main Application Module
 * Bootstraps the Travel Umroh platform with all feature modules
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: "postgres",
      ...typeOrmDatabaseConfig,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
      synchronize: false, // Always use migrations in production
      logging: process.env.NODE_ENV === "development",
    }),
    TypeOrmModule.forFeature([TenantEntity]),

    // Feature Modules
    RolesModule,
    WhatsAppModule,
    ChatbotModule,
    LandingPagesModule,
    LeadsModule,
    AnalyticsModule,
    PaymentsModule,

    // Infrastructure Modules (Epic 8)
    WebSocketModule,
    QueueModule,
    CacheModule,

    // Epic 2: Multi-Tenant Agency Management
    TenantsModule,
    AuthModule,
    UsersModule,

    // Epic 4: Package Management
    PackagesModule,

    // Epic 5: Agent Management & "My Jamaah" Dashboard
    JamaahModule,

    // Epic 6: Document Management with OCR Integration Stub
    DocumentsModule,

    // Integration 1: OCR Document Intelligence (Verihubs)
    OcrModule,

    // Epic 12: Sharia Compliance & Regulatory Reporting
    ComplianceModule,

    // Integration 5: E-Signature Integration (PrivyID)
    ESignatureModule,

    // Integration 6: SISKOPATUH Government Reporting
    SiskopatuhModule,

    // TODO: Add remaining modules as they are implemented:
    // - BookingsModule (Epic 7)
  ],
  controllers: [],
  providers: [TenantMiddleware],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware
   */
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant middleware first to extract tenant from subdomain
    consumer.apply(TenantMiddleware).forRoutes("*");

    // Then apply RLS session middleware to set tenant context in database
    // This sets PostgreSQL session variables for Row-Level Security
    consumer.apply(RlsSessionMiddleware).forRoutes("*");
  }
}
