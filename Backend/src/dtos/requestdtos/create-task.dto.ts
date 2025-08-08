import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional } from "class-validator";
import { TaskStatus } from "../../types/tasks.types";

export class CreateTaskDto {
  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString({ message: "Description must be a string" })
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @IsOptional()
  @IsEnum(["pending", "in-progress", "completed"], {
    message: "Status must be one of: pending, in-progress, completed"
  })
  status?: TaskStatus = "pending";

  @IsDateString({}, { message: "Due date must be a valid date string" })
  @IsNotEmpty({ message: "Due date is required" })
  dueDate!: string;
}
