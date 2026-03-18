import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { NextFunction, Request, Response } from "express";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";

function resolveFrontendDistPath() {
  const candidates = [
    join(process.cwd(), "app", "dist", "app", "browser"),
    join(process.cwd(), "..", "app", "dist", "app", "browser"),
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

async function bootstrap() {
  const bootstrapLogger = new Logger("Initialisation");
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });
  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);
  const port = Number(process.env.PORT || configService.get<string>("PORT") || 3000);
  const corsOrigin = configService.get<string>(
    "CORS_ORIGIN",
    "http://localhost:4200",
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const frontendDistPath = resolveFrontendDistPath();
  if (frontendDistPath) {
    app.useStaticAssets(frontendDistPath);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get(/^(?!\/api).*/, (request: Request, response: Response, next: NextFunction) => {
      if (request.path.includes(".")) {
        return next();
      }

      return response.sendFile(join(frontendDistPath, "index.html"));
    });
    bootstrapLogger.log(`Frontend statique servi depuis ${frontendDistPath}`);
  } else {
    bootstrapLogger.warn("Build frontend introuvable, démarrage API seul");
  }

  await app.listen(port, "0.0.0.0");
  bootstrapLogger.log(`API en écoute sur http://0.0.0.0:${port}/api`);
  bootstrapLogger.log(`Origine CORS : ${corsOrigin}`);
}
bootstrap();
