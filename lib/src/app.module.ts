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

function resolveMongoUri(configService: ConfigService) {
  const mongoUri = configService.get<string>("MONGODB_URI");
  const nodeEnv = configService.get<string>("NODE_ENV", "development");
  const isProduction = nodeEnv === "production";

  if (mongoUri) {
    return mongoUri;
  }

  if (isProduction) {
    throw new Error("MONGODB_URI manquant en production");
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
