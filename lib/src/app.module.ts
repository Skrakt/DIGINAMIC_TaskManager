import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";
import { StatsModule } from "./stats/stats.module";

const mongoLogger = new Logger("MongoDB");

function buildMongoUriFromParts(configService: ConfigService) {
  const host = configService.get<string>("MONGOHOST") || configService.get<string>("MONGO_HOST");
  const port = configService.get<string>("MONGOPORT") || configService.get<string>("MONGO_PORT");
  const user = configService.get<string>("MONGOUSER") || configService.get<string>("MONGO_USER");
  const password =
    configService.get<string>("MONGOPASSWORD") || configService.get<string>("MONGO_PASSWORD");
  const database =
    configService.get<string>("MONGODATABASE") ||
    configService.get<string>("MONGO_DATABASE") ||
    "task-manager";

  if (!host || !port) {
    return null;
  }

  const encodedUser = user ? encodeURIComponent(user) : "";
  const encodedPassword = password ? encodeURIComponent(password) : "";
  const authPrefix =
    encodedUser && encodedPassword
      ? `${encodedUser}:${encodedPassword}@`
      : encodedUser
        ? `${encodedUser}@`
        : "";

  const authSource = configService.get<string>("MONGO_AUTH_SOURCE", "admin");
  const authQuery = authPrefix ? `?authSource=${encodeURIComponent(authSource)}` : "";

  return `mongodb://${authPrefix}${host}:${port}/${database}${authQuery}`;
}

function resolveMongoUri(configService: ConfigService) {
  const mongoUri =
    configService.get<string>("MONGODB_URI") ||
    configService.get<string>("DATABASE_URL") ||
    configService.get<string>("MONGO_URL") ||
    configService.get<string>("MONGO_URI");
  const nodeEnv = configService.get<string>("NODE_ENV", "development");
  const isProduction = nodeEnv === "production";

  if (mongoUri) {
    return mongoUri;
  }

  const mongoUriFromParts = buildMongoUriFromParts(configService);
  if (mongoUriFromParts) {
    return mongoUriFromParts;
  }

  if (isProduction) {
    throw new Error(
      "URI Mongo manquante en production (MONGODB_URI, DATABASE_URL, MONGO_URL, MONGO_URI ou MONGOHOST/MONGOPORT)",
    );
  }

  return "mongodb://localhost:27017/task-manager";
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: resolveMongoUri(configService),
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectionFactory: (connection: Connection) => {
          connection.on("connected", () => {
            mongoLogger.log(`Connecté (${connection.host}:${connection.port})`);
          });

          connection.on("disconnected", () => {
            mongoLogger.warn("Déconnecté");
          });

          connection.on("error", (error: Error) => {
            mongoLogger.error(`Erreur de connexion : ${error.message}`);
          });

          return connection;
        },
      }),
    }),
    AuthModule,
    CategoriesModule,
    UsersModule,
    TasksModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
