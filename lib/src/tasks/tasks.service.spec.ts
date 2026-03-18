import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { CategoriesService } from "../categories/categories.service";
import { Task } from "./schemas/task.schema";
import { TasksService } from "./tasks.service";

describe("TasksService", () => {
  let service: TasksService;

  beforeEach(async () => {
    const test_module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            ensureOwnedByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = test_module.get<TasksService>(TasksService);
  });

  it("doit être défini", () => {
    expect(service).toBeDefined();
  });
});
