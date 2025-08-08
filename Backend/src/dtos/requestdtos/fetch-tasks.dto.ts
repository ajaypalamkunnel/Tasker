import { IsEnum, IsOptional, IsInt, Min, Max } from "class-validator";
import { Transform } from "class-transformer";
import { TaskStatus } from "../../types/tasks.types";

export class FetchTasksDto {
  @IsOptional()
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be greater than 0" })
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  @Max(100, { message: "Limit cannot exceed 100" })
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsEnum(["pending", "in-progress", "completed"], {
    message: "Status must be one of: pending, in-progress, completed"
  })
  status?: TaskStatus;
} 