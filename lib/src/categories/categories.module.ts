import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Task, TaskSchema } from "../tasks/schemas/task.schema";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./schemas/category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, MongooseModule],
})
export class CategoriesModule {}
