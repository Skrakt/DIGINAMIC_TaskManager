import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { CurrentUserData } from "../auth/interfaces/current-user.interface";
import { Task, TaskDocument, TaskStatus } from "../tasks/schemas/task.schema";

export interface StatsOverview {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async getOverview(_user: CurrentUserData): Promise<StatsOverview> {
    const aggregation = await this.taskModel
      .aggregate<{
        _id: string;
        count: number;
      }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .exec();

    const counters = new Map(aggregation.map((item) => [item._id, item.count]));
    const todo = counters.get(TaskStatus.TODO) ?? 0;
    const inProgress = counters.get(TaskStatus.IN_PROGRESS) ?? 0;
    const done = counters.get(TaskStatus.DONE) ?? 0;

    return {
      total: todo + inProgress + done,
      todo,
      inProgress,
      done,
    };
  }
}
