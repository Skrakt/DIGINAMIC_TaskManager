import { IsOptional, IsString } from "class-validator";

export class QueryCategoryDto {
  @IsString()
  @IsOptional()
  search: string;
}
