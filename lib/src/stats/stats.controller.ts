import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { CurrentUserData } from "../auth/interfaces/current-user.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { StatsService } from "./stats.service";

@UseGuards(JwtAuthGuard)
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("overview")
  getOverview(@CurrentUser() user: CurrentUserData) {
    return this.statsService.getOverview(user);
  }
}
