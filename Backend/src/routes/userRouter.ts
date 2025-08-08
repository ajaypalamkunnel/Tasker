import { Router } from "express";
import UserRepository from "../repository/implementation/User/UserRepository";
import UserService from "../service/implementation/user/UserService";
import UserController from "../controller/implementation/user/UserController";
import TaskRepository from "../repository/implementation/Tasks/TaskRepository";
import TaskService from "../service/implementation/Tasks/TaskService";
import TaskController from "../controller/implementation/tasks/TaskController";


const router = Router()




const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

const taskRepository = new TaskRepository()
const taskService = new TaskService(taskRepository,userRepository)
const taskController = new TaskController(taskService,userService)



export default router