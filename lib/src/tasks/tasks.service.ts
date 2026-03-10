import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { CategoriesService } from '../categories/categories.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { QueryTaskDto } from './dto/query_task.dto';
import { UpdateTaskDto } from './dto/update_task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(user: CurrentUserData, dto: CreateTaskDto) {
    await this.categoriesService.ensureOwnedByUser(user.userId, dto.categoryId);

    const task = await this.taskModel.create({
      authorId: new Types.ObjectId(user.userId),
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      status: dto.status,
      priority: dto.priority,
      categoryId: new Types.ObjectId(dto.categoryId),
    });

    const populatedTask = await task.populate({
      path: 'categoryId',
      select: 'name',
    });

    return this.serializeTask(populatedTask.toObject());
  }

  async findAll(user: CurrentUserData, query: QueryTaskDto) {
    const filters: Record<string, unknown> = {
      authorId: new Types.ObjectId(user.userId),
    };

    if (query.status) {
      filters.status = query.status;
    }
    if (query.priority) {
      filters.priority = query.priority;
    }
    if (query.categoryId) {
      filters.categoryId = new Types.ObjectId(query.categoryId);
    }
    if (query.search?.trim()) {
      filters.$or = [
        { title: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
      ];
    }

    const tasks = await this.taskModel
      .find(filters)
      .populate({ path: 'categoryId', select: 'name' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return tasks.map((task) => this.serializeTask(task));
  }

  async findOne(user: CurrentUserData, taskId: string) {
    const task = await this.taskModel
      .findOne({
        _id: new Types.ObjectId(taskId),
        authorId: new Types.ObjectId(user.userId),
      })
      .populate({ path: 'categoryId', select: 'name' })
      .lean()
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.serializeTask(task);
  }

  async update(user: CurrentUserData, taskId: string, dto: UpdateTaskDto) {
    if (dto.categoryId) {
      await this.categoriesService.ensureOwnedByUser(user.userId, dto.categoryId);
    }

    const update: Record<string, unknown> = {};
    if (dto.title !== undefined) {
      update.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      update.description = dto.description.trim();
    }
    if (dto.status !== undefined) {
      update.status = dto.status;
    }
    if (dto.priority !== undefined) {
      update.priority = dto.priority;
    }
    if (dto.categoryId !== undefined) {
      update.categoryId = new Types.ObjectId(dto.categoryId);
    }

    const task = await this.taskModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(taskId),
          authorId: new Types.ObjectId(user.userId),
        },
        update,
        { new: true, runValidators: true },
      )
      .populate({ path: 'categoryId', select: 'name' })
      .lean()
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.serializeTask(task);
  }

  async remove(user: CurrentUserData, taskId: string) {
    const result = await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(taskId),
      authorId: new Types.ObjectId(user.userId),
    });

    if (!result) {
      throw new NotFoundException('Task not found');
    }

    return { deleted: true };
  }

  private serializeTask(task: any) {
    const populatedCategory = task.categoryId;
    const isPopulatedCategory =
      populatedCategory &&
      typeof populatedCategory === 'object' &&
      'name' in populatedCategory;

    return {
      ...task,
      categoryId: isPopulatedCategory
        ? populatedCategory._id.toString()
        : task.categoryId?.toString(),
      category: isPopulatedCategory
        ? {
            _id: populatedCategory._id.toString(),
            name: populatedCategory.name,
          }
        : null,
    };
  }
}
