import { Test, TestingModule } from "@nestjs/testing";
import { CurrentUserData } from "../auth/interfaces/current-user.interface";
import { UserRole } from "../users/schemas/user.schema";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

describe("StatsController", () => {
  let controller: StatsController;
  let statsService: { getOverview: jest.Mock };

  beforeEach(async () => {
    statsService = {
      getOverview: jest.fn(),
    };

    const test_module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: statsService,
        },
      ],
    }).compile();

    controller = test_module.get<StatsController>(StatsController);
  });

  it("doit être défini", () => {
    expect(controller).toBeDefined();
  });

  it("doit retourner le résumé pour utilisateur courant", async () => {
    const user: CurrentUserData = {
      userId: "65d0f4d2c2c52795f9da8a92",
      email: "john@doe.com",
      role: UserRole.USER,
    };
    const response = { total: 3, todo: 1, inProgress: 1, done: 1 };
    statsService.getOverview.mockResolvedValue(response);

    await expect(controller.getOverview(user)).resolves.toEqual(response);
    expect(statsService.getOverview).toHaveBeenCalledWith(user);
  });
});
