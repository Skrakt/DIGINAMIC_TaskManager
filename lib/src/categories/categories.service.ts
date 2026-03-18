import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import type { CurrentUserData } from "../auth/interfaces/current-user.interface";
import { Task, TaskDocument } from "../tasks/schemas/task.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { QueryCategoryDto } from "./dto/query-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category, CategoryDocument } from "./schemas/category.schema";

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
      const cleanName = dto.name.trim();
      const category = await this.categoryModel.create({
        authorId: new Types.ObjectId(user.userId),
        name: cleanName,
        normalizedName: cleanName.toLowerCase(),
      });

      return category.toObject();
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException("Le nom de la catégorie existe déjà");
      }
      throw error;
    }
  }

  async findAll(user: CurrentUserData, query: QueryCategoryDto) {
    const filters: Record<string, unknown> = {
      authorId: new Types.ObjectId(user.userId),
    };

    if (query.search?.trim()) {
      filters.name = { $regex: query.search.trim(), $options: "i" };
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
      const cleanName = dto.name.trim();
      update.name = cleanName;
      update.normalizedName = cleanName.toLowerCase();
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
        throw new NotFoundException("Catégorie introuvable");
      }

      return category;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error)) {
        throw new ConflictException("Le nom de la catégorie existe déjà");
      }
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
        "La catégorie ne peut pas être supprimée tant que des tâches y sont associées",
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
      throw new NotFoundException("Catégorie introuvable");
    }

    return category;
  }

  private isDuplicateKeyError(error: unknown): boolean {
    if (typeof error !== "object" || error === null || !("code" in error)) {
      return false;
    }

    return (error as { code?: unknown }).code === 11000;
  }
}
