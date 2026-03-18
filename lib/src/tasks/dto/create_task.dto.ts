import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { TaskPriority, TaskStatus } from "../schemas/task.schema";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority: TaskPriority;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;
}
