import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Schema()
export class Task {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 150,
  })
  title: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 2000,
  })
  description: string;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Prop({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  category: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ authorId: 1, status: 1 });
TaskSchema.index({ authorId: 1, category: 1 });
