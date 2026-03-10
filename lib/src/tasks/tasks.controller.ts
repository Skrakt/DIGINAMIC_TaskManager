import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MongoIdPipe } from '../common/pipes/mongo-id.pipe';
import { CreateTaskDto } from './dto/create_task.dto';
import { QueryTaskDto } from './dto/query_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user, createTaskDto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserData, @Query() query: QueryTaskDto) {
    return this.tasksService.findAll(user, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id', MongoIdPipe) id: string,
  ) {
    return this.tasksService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserData,
    @Param('id', MongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user, id, updateTaskDto);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id', MongoIdPipe) id: string,
  ) {
    return this.tasksService.remove(user, id);
  }
}
