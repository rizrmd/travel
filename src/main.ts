import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  // Global prefix for all routes
  app.setGlobalPrefix("api/v1");

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle("Travel Umroh API")
    .setDescription("Multi-tenant SaaS platform for Umroh travel agencies")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Roles & Permissions", "Agent hierarchy and role management")
    .addTag("Payments", "Payment processing and installment management")
    .addTag("Commissions", "Commission tracking and payout management")
    .addTag("WhatsApp Integration (Coming Soon)", "WhatsApp Business API stubs")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Redirect bare domain to API docs for API-only deployments.
  app.getHttpAdapter().getInstance().get("/", (_req, res) => {
    res.redirect("/api/docs");
  });

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║   Travel Umroh Platform API                       ║
    ║                                                   ║
    // ║   Server:     http://localhost:${port}               ║
    // ║   API:        http://localhost:${port}/api/v1        ║
    // ║   Docs:       http://localhost:${port}/api/docs      ║
    ║   WebSocket:  ws://localhost:${port}/ws              ║
    ║                                                   ║
    ║   Status:     Running ✓                           ║
    ║   Epic 7:     Payments ✓                          ║
    ║   Epic 8:     Real-Time Infrastructure ✓          ║
    ╚═══════════════════════════════════════════════════╝
  `);
}

bootstrap();
