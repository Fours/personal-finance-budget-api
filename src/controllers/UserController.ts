import { validate } from "uuid"
import { messages, type Message } from "../dto/Message.ts";
import type { Request, Response } from "express";
import type IUserHandler from "../domain/handlers/IUserHandler";
import type { User } from "../dto/response/User.ts";

export default class UserController {

    private readonly userHandler: IUserHandler

    constructor(userHandler: IUserHandler) {
        this.userHandler = userHandler
    }

    async getAll(req: Request<{}, unknown, {}, { limit?: number, start?: number }>, res: Response<User[] | Message>): Promise<void> {
        
        const limit = Number(req.query.limit || 50);
        const start = Number(req.query.start || 0);

        if (Number.isNaN(limit) || Number.isNaN(start)) {
            res.status(400).json({ message: "Optional query params 'limit' and 'start' must be numbers if provided"})
            return
        }

        if (limit === 0) {
            res.status(400).json({ message: "Query param 'limit' must not be zero"})
            return
        }

        if (res.locals.user && Array.isArray(res.locals.user.roles) && res.locals.user.roles.includes("admin")) {
            try {
                const users = await this.userHandler.getAll(limit, start)
                res.json(users) // todo: remove passwords
            } catch (error) {
                console.error(error)
                res.status(500).json(messages.InternalServerError)
            }
        } else {
            res.status(403).json({ message: "Admin permission required" })
        }
    }

    async getOne(req: Request<{ id: string }>, res: Response<User | Message>): Promise<void> {
        
        const userId = req.params.id
        if (!validate(userId)) {
            res.status(400).json({ message: "User id must be a valid UUID" })
            return    
        }

        if (res.locals.user && Array.isArray(res.locals.user.roles) && res.locals.user.roles.includes("admin")) {
            const user = await this.userHandler.getOne(userId)
            if (user) {
                res.json(user) // todo: remove password
            } else {
                res.status(404).json({ message: "User not found" })
            }    
        } else {
            res.status(403).json({ message: "Admin permission required" })
        }
    }
}

