import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "../../categories/schemas/category.schema";
import { User } from "../../users/schemas/user.schema";
import { IsNotEmpty } from "class-validator";

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Task {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  @IsNotEmpty()
  authorId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
  })
  @IsNotEmpty()
  title: string;

  @Prop({
    default: "",
    trim: true,
    maxlength: 2000,
  })
  @IsNotEmpty()
  description: string;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsNotEmpty()
  status: TaskStatus;

  @Prop({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsNotEmpty()
  priority: TaskPriority;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Category.name,
    index: true,
  })
  @IsNotEmpty()
  categoryId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ authorId: 1, status: 1 });
TaskSchema.index({ authorId: 1, categoryId: 1 });
TaskSchema.index({ authorId: 1, createdAt: -1 });
