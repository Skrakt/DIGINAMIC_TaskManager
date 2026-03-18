import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { CurrentUserData } from "../auth/interfaces/current-user.interface";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { MongoIdPipe } from "../common/pipes/mongo-id.pipe";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { QueryCategoryDto } from "./dto/query-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@UseGuards(JwtAuthGuard)
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserData,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user, createCategoryDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: CurrentUserData,
    @Query() query: QueryCategoryDto,
  ) {
    return this.categoriesService.findAll(user, query);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: CurrentUserData,
    @Param("id", MongoIdPipe) id: string,
  ) {
    return this.categoriesService.findOne(user, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: CurrentUserData,
    @Param("id", MongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user, id, updateCategoryDto);
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: CurrentUserData,
    @Param("id", MongoIdPipe) id: string,
  ) {
    return this.categoriesService.remove(user, id);
  }
}
