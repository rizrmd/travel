import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
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

  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === "true" ||
    process.env.NODE_ENV !== "production";

  if (swaggerEnabled) {
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
  }

  const serveFrontend =
    process.env.SERVE_FRONTEND === "true" ||
    process.env.NODE_ENV === "production";

  if (serveFrontend) {
    const frontendServerPath = join(__dirname, "frontend", "server.js");
    if (existsSync(frontendServerPath)) {
      const frontendPort = parseInt(process.env.FRONTEND_PORT || "3002", 10);
      const frontendTarget = `http://127.0.0.1:${frontendPort}`;

      const frontendProcess = spawn("node", [frontendServerPath], {
        stdio: "inherit",
        env: {
          ...process.env,
          PORT: String(frontendPort),
          HOSTNAME: "127.0.0.1",
        },
      });

      frontendProcess.on("exit", (code) => {
        console.error(
          `[frontend] standalone process exited with code ${code ?? "unknown"}`,
        );
      });

      const expressApp = app.getHttpAdapter().getInstance();
      const frontendProxy = createProxyMiddleware({
        target: frontendTarget,
        changeOrigin: true,
        ws: true,
      });

      expressApp.use((req, res, next) => {
        if (
          req.path.startsWith("/api") ||
          req.path.startsWith("/ws") ||
          req.path.startsWith("/socket.io")
        ) {
          return next();
        }
        return frontendProxy(req, res, next);
      });

      const shutdown = () => {
        if (!frontendProcess.killed) {
          frontendProcess.kill("SIGTERM");
        }
      };
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    } else {
      console.warn(
        `[frontend] standalone server not found at ${frontendServerPath}; serving API only`,
      );
    }
  }

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
