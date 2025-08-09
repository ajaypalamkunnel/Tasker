import { IPaginatedTasksResponse, ITask } from "../../../types/tasks.types";
import { PaginatedTasksResponseDTO, TaskDTO } from "../dtos/task.dto";

export class TaskMapper {
  static toTaskDTO(task: ITask): TaskDTO {
    return {
      _id: task._id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  static toPaginatedTasksDTO(
    data: IPaginatedTasksResponse
  ): PaginatedTasksResponseDTO {
    return {
      tasks: data.tasks.map(this.toTaskDTO),
      pagination: {
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalTasks: data.pagination.totalTasks,
        hasNextPage: data.pagination.hasNextPage,
        hasPrevPage: data.pagination.hasPrevPage
      }
    };
  }
}
