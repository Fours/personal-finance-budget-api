import express from "express"
import type { Express, Request, Response } from "express"
import cors from "cors"
import { prisma } from "./lib/prisma.ts"
import UserRepository from "./repositories/UserRepository.ts"
import type { Message } from "./dto/Message.ts"
import UserHandler from "./domain/handlers/UserHandler.ts"
import AuthController from "./controllers/AuthController.ts"

const userRepository = new UserRepository(prisma)
const userHandler = new UserHandler(userRepository)
const authController = new AuthController(userHandler)

const app: Express = express()

app.use(cors())
app.use(express.json());

app.post("/api/auth/register", authController.register.bind(authController))

app.use((req: Request, res: Response<Message>): void => {
    res.status(404).json({message: "No endpoint found"})
})

export default app