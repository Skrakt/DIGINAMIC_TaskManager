import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(user: CurrentUserData, dto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create({
        authorId: new Types.ObjectId(user.userId),
        name: dto.name.trim(),
        normalizedName: this.normalizeName(dto.name),
      });

      return category.toObject();
    } catch (error) {
      this.handleDuplicateKey(error);
      throw error;
    }
  }

  async findAll(user: CurrentUserData, query: QueryCategoryDto) {
    const filters: Record<string, unknown> = {
      authorId: new Types.ObjectId(user.userId),
    };

    if (query.search?.trim()) {
      filters.name = { $regex: query.search.trim(), $options: 'i' };
    }

    return this.categoryModel.find(filters).sort({ name: 1 }).lean().exec();
  }

  async findOne(user: CurrentUserData, categoryId: string) {
    return this.findOwnedCategoryOrFail(user.userId, categoryId);
  }

  async update(
    user: CurrentUserData,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    const update: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      update.name = dto.name.trim();
      update.normalizedName = this.normalizeName(dto.name);
    }

    try {
      const category = await this.categoryModel
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(categoryId),
            authorId: new Types.ObjectId(user.userId),
          },
          update,
          { new: true, runValidators: true },
        )
        .lean()
        .exec();

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      this.handleDuplicateKey(error);
      throw error;
    }
  }

  async remove(user: CurrentUserData, categoryId: string) {
    await this.findOwnedCategoryOrFail(user.userId, categoryId);

    const tasksCount = await this.taskModel.countDocuments({
      authorId: new Types.ObjectId(user.userId),
      categoryId: new Types.ObjectId(categoryId),
    });

    if (tasksCount > 0) {
      throw new ConflictException(
        'Category cannot be deleted while tasks are still attached',
      );
    }

    await this.categoryModel.deleteOne({
      _id: new Types.ObjectId(categoryId),
      authorId: new Types.ObjectId(user.userId),
    });

    return { deleted: true };
  }

  async ensureOwnedByUser(userId: string, categoryId: string) {
    return this.findOwnedCategoryOrFail(userId, categoryId);
  }

  private async findOwnedCategoryOrFail(userId: string, categoryId: string) {
    const category = await this.categoryModel
      .findOne({
        _id: new Types.ObjectId(categoryId),
        authorId: new Types.ObjectId(userId),
      })
      .lean()
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  private normalizeName(name: string) {
    return name.trim().toLowerCase();
  }

  private handleDuplicateKey(error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException('Category name already exists');
    }
  }
}
