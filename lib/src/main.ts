import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const bootstrapLogger = new Logger("Initialisation");
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });
  app.setGlobalPrefix("api");

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);
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

  await app.listen(port);
  bootstrapLogger.log(`API en écoute sur http://localhost:${port}/api`);
  bootstrapLogger.log(`Origine CORS : ${corsOrigin}`);
}
bootstrap();
