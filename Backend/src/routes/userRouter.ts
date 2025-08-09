import { Router } from "express";
import UserRepository from "../repository/implementation/User/UserRepository";
import UserService from "../service/implementation/user/UserService";
import UserController from "../controller/implementation/user/UserController";
import TaskRepository from "../repository/implementation/Tasks/TaskRepository";
import TaskService from "../service/implementation/Tasks/TaskService";
import TaskController from "../controller/implementation/tasks/TaskController";
import { validateRequest } from "../middleware/validate";
import { RegisterDto } from "../dtos/requestdtos/register.dto";
import { LoginDto } from "../dtos/requestdtos/login.dto";
import { CreateTaskDto } from "../dtos/requestdtos/create-task.dto";
import { FetchTasksDto } from "../dtos/requestdtos/fetch-tasks.dto";
import authMiddleware from "../middleware/authMiddleware";
import { refreshTokenLimiter, loginLimiter } from "../middleware/rateLimiter";


const router = Router()




const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

const taskRepository = new TaskRepository()
const taskService = new TaskService(taskRepository)
const taskController = new TaskController(taskService,userService)



router.post("/signup",validateRequest(RegisterDto),userController.registerUser)
router.post("/login",loginLimiter,validateRequest(LoginDto),userController.postLogin)
router.post("/logout",userController.logout)
router.post("/refresh-token",refreshTokenLimiter,userController.renewAuthTokens)

// Task routes
router.get("/tasks", authMiddleware, taskController.fetchTasks)
router.post("/tasks", authMiddleware, validateRequest(CreateTaskDto), taskController.addTask)
router.patch("/tasks/:id/status", authMiddleware, taskController.updateTaskStatus)
router.put("/tasks/:id", authMiddleware, taskController.editTask)
router.delete("/tasks/:id", authMiddleware, taskController.deleteTask)



export default router