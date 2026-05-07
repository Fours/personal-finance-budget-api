import jwt, { type JwtPayload } from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {

    const JWT_SECRET = process.env.JWT_SECRET || "" // already validated in index.ts
    
    const authHeader = req.headers.authorization || " "
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        if (decoded) {
            res.locals.user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                roles: decoded.roles
            }
            next()
        } else {
            res.status(401).json({
                message: "Unauthorized: invalid token"
            })
        }
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: invalid token"
        })
    }
}