import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
