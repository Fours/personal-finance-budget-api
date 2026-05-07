import express from "express"
import type { Express, Request, Response } from "express"
import cors from "cors"
import { prisma } from "./lib/prisma.ts"
import UserRepository from "./repositories/UserRepository.ts"
import type { Message } from "./dto/response/Message.ts"
import UserHandler from "./domain/handlers/UserHandler.ts"
import AuthController from "./controllers/AuthController.ts"
import { authenticate } from "./middleware/authMiddleware.ts"
import UserController from "./controllers/UserController.ts"
import EventDispatcher from "./services/EventDispatcher.ts"
import CategoryRepository from "./repositories/CategoryRepository.ts"
import CategoryHandler from "./domain/handlers/CategoryHandler.ts"
import CategoryController from "./controllers/CategoryController.ts"

const eventDispatcher = new EventDispatcher()
const userRepository = new UserRepository(prisma)
const categoryRepository = new CategoryRepository(prisma)
const userHandler = new UserHandler(userRepository, eventDispatcher)
const categoryHandler = new CategoryHandler(categoryRepository)
const authController = new AuthController(userHandler)
const userController = new UserController(userHandler)
const categoryController = new CategoryController(categoryHandler)

const app: Express = express()

app.use(cors())
app.use(express.json());

// auth
app.post("/api/auth/register", authController.register.bind(authController))
app.post("/api/auth/login", authController.login.bind(authController))
app.get("/api/auth/validate", authenticate, authController.validate.bind(authController))

// users - admin role required
app.get("/api/users", authenticate, userController.getAll.bind(userController))
app.get("/api/users/:id", authenticate, userController.getOne.bind(userController))

// categories
app.get("/api/categories", authenticate, categoryController.getAll.bind(categoryController))

app.use((req: Request, res: Response<Message>): void => {
    res.status(404).json({ message: "No endpoint found" })
})

export default app