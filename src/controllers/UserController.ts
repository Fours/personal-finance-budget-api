import type { Message } from "../dto/response/Message.ts";
import type { Request, Response } from "express";
import type IUserHandler from "../domain/handlers/IUserHandler";
import type { User } from "../dto/response/User.ts"
import validateUUID from "../lib/validateUUID.ts";
import errorResponses from "../lib/errorResponses.ts";

export default class UserController {

    private readonly userHandler: IUserHandler

    constructor(userHandler: IUserHandler) {
        this.userHandler = userHandler
    }

    async getAll(req: Request<{}, unknown, {}, { limit?: number, start?: number }>, res: Response<User[] | Message>): Promise<void> {
        
        let limit
        let start
        if (req.query.limit) {
            limit = Number(req.query.limit)
        }
        if (req.query.start) {
            start = Number(req.query.start)
        }
        // have to check query params are truthy here because NaN evaluates to false
        if ((req.query.limit && Number.isNaN(limit)) || (req.query.start && Number.isNaN(start))) {
            res.status(400).json({ message: "Optional query params 'limit' and 'start' must be numbers if provided"})
            return
        }

        if (Array.isArray(res.locals.user?.roles) && res.locals.user.roles.includes("admin")) {
            try {
                const users = await this.userHandler.getAll(limit, start)                
                res.json(users)
            } catch (error) {
                errorResponses(res, error)
            }
        } else {
            res.status(403).json({ message: "Admin permission required" })
        }
    }

    async getOne(req: Request<{ id: string }>, res: Response<User | Message>): Promise<void> {
        
        const userId = req.params.id
        if (!validateUUID(userId)) {
            res.status(400).json({ message: "User id must be a valid UUID" })
            return    
        }

        if (res.locals.user && Array.isArray(res.locals.user.roles) && res.locals.user.roles.includes("admin")) {
            try {
                const user = await this.userHandler.getOne(userId)
                res.json(user)
            } catch(error) {
                errorResponses(res, error)
            }
        } else {
            res.status(403).json({ message: "Admin permission required" })
        }
    }
}

