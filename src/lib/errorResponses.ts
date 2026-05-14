import type { Response } from "express"
import type { Message } from "../dto/response/Message";
import ValidationError from "../domain/errors/ValidationError.ts";
import NotFound from "../domain/errors/NotFound.ts";
import Unauthorized from "../domain/errors/Unauthorized.ts";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed.ts";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";

export default function errorResponses<T>(res: Response<T | Message>, error: any): void {

    if (error instanceof ValidationError) {
        res.status(400).json({ message: `${error.name}: ${error.message}` })
    } else if (error instanceof NotFound) {
        res.status(404).json({ message: `${error.message}` })
    } else if (error instanceof Unauthorized) {
        res.status(401).json({ message: `${error.name}: ${error.message}` })
    } else if (error instanceof ForeignConstraintFailed) {
        res.status(400).json({ message: `${error.name}: ${error.message}` })
    } else if (error instanceof UniqueConstraintFailed) {
        res.status(400).json({ message: `${error.name}: ${error.message}` })
    } else {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}