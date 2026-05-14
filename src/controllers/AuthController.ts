import jwt from "jsonwebtoken"
import type { Request, Response } from "express";
import type { Message } from "../dto/response/Message.ts";
import type UserHandler from "../domain/handlers/UserHandler.ts";
import type { Register } from "../dto/request/Register.ts";
import type { UserToken } from "../dto/response/UserToken.ts";
import type { Login } from "../dto/request/Login.ts";
import type { User } from "../dto/response/User.ts";
import errorResponses from "../lib/errorResponses.ts";

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
            const token = this.createJwtToken(user)
            res.status(201).json({
                user: user,
                token
            })
        } catch (error) {
            errorResponses(res, error)
        }        
    }

    async login(req: Request<{}, unknown, Login>, res: Response<UserToken | Message>): Promise<void> {
        try {
            const user = await this.userHandler.login(req.body)
            const token = this.createJwtToken(user)            
            res.status(200).json({
                user: user,
                token
            })
        } catch (error) {
            errorResponses(res, error)
        }
    }

    async validate(req: Request, res: Response): Promise<void> {
        res.status(200).json(res.locals.user)
    }

    private createJwtToken(user: User): string {
        return jwt.sign(user, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES as " "})
    }
}