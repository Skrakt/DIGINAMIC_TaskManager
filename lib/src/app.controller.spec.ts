import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const test_app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = test_app.get<AppController>(AppController);
  });

  describe("racine", () => {
    it('doit retourner "Bonjour le monde !"', () => {
      expect(appController.getHello()).toBe("Bonjour le monde !");
    });
  });
});
