import jwt from "jsonwebtoken"
import type { Request, Response } from "express";
import { messages } from "../dto/Message.ts";
import type { Message } from "../dto/Message.ts";
import type UserHandler from "../domain/handlers/UserHandler.ts";
import type { Register } from "../dto/Register.ts";
import ValidationError from "../domain/errors/ValidationError.ts";
import type { UserToken } from "../dto/UserToken.ts";

export default class AuthController {

    private readonly userHandler: UserHandler
    private readonly JWT_SECRET: string
    private readonly JWT_EXPIRES: string

    constructor(userHandler: UserHandler) {
        this.userHandler = userHandler
        this.JWT_SECRET = process.env.JWT_SECRET || "" // validated in index.ts
        this.JWT_EXPIRES = process.env.JWT_EXPIRES || "1d"
    }

    async register(req: Request<{}, unknown, Register>, res: Response<UserToken | Message>): Promise<void> {
        try {
            const user = await this.userHandler.register(req.body)
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles
            }, process.env.JWT_SECRET!, { expiresIn: '1h' })
            res.status(201).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles
                },
                token
            })
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({
                    message: `${error.name}: ${error.message}`
                })
            } else {
                console.error(error)
                res.status(500).json(messages.InternalServerError)
            }
        }        
    }

    // todo: login

    // todo: validate

}