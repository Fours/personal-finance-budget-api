import express from "express"
import type { Express, Request, Response } from "express"
import cors from "cors"
import { prisma } from "./lib/prisma.ts"
import UserRepository from "./repositories/UserRepository.ts"
import type { Message } from "./dto/Message.ts"
import UserHandler from "./domain/handlers/UserHandler.ts"
import AuthController from "./controllers/AuthController.ts"
import { authenticate } from "./middleware/authMiddleware.ts"
import UserController from "./controllers/UserController.ts"

const userRepository = new UserRepository(prisma)
const userHandler = new UserHandler(userRepository)
const authController = new AuthController(userHandler)
const userController = new UserController(userHandler)

const app: Express = express()

app.use(cors())
app.use(express.json());

// auth
app.post("/api/auth/register", authController.register.bind(authController))
app.post("/api/auth/login", authController.login.bind(authController))
app.get("/api/auth/validate", authenticate, authController.validate.bind(authController))

// users - admin role required
app.get("/api/users", authenticate, userController.getAll.bind(userController))

app.use((req: Request, res: Response<Message>): void => {
    res.status(404).json({ message: "No endpoint found" })
})

export default app