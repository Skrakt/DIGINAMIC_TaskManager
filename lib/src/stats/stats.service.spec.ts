import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Task, TaskStatus } from "../tasks/schemas/task.schema";
import { StatsService } from "./stats.service";

describe("StatsService", () => {
  let service: StatsService;
  let taskModel: { aggregate: jest.Mock };

  beforeEach(async () => {
    taskModel = {
      aggregate: jest.fn(),
    };

    const test_module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getModelToken(Task.name),
          useValue: taskModel,
        },
      ],
    }).compile();

    service = test_module.get<StatsService>(StatsService);
  });

  it("doit être défini", () => {
    expect(service).toBeDefined();
  });

  it("doit retourner des compteurs agrégés par statut", async () => {
    taskModel.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { _id: TaskStatus.TODO, count: 2 },
        { _id: TaskStatus.IN_PROGRESS, count: 4 },
        { _id: TaskStatus.DONE, count: 1 },
      ]),
    });

    await expect(
      service.getOverview({
        userId: "65d0f4d2c2c52795f9da8a92",
        email: "john@doe.com",
        role: "user",
      }),
    ).resolves.toEqual({
      total: 7,
      todo: 2,
      inProgress: 4,
      done: 1,
    });
  });

  it("doit retourner des zéros quand l'utilisateur n'a aucune tâche", async () => {
    taskModel.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    });

    await expect(
      service.getOverview({
        userId: "65d0f4d2c2c52795f9da8a92",
        email: "john@doe.com",
        role: "user",
      }),
    ).resolves.toEqual({
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    });
  });
});
