import type { Request, Response } from "express";
import type ITransactionHandler from "../domain/handlers/ITransactionHandler";
import { messages } from "../dto/response/Message.ts";

export default class TransactionController {

    private readonly transactionHandler: ITransactionHandler

    constructor(transactionHandler: ITransactionHandler) {
        this.transactionHandler = transactionHandler
    }

    async getAll(req: Request<{}, unknown, { limit?: string, start?: string }>, res: Response): Promise<void> {

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
            res.status(400).json({ message: "Optional query params 'limit' and 'start' must be numbers if provided" })
            return
        }
        try {
            const transactions = await this.transactionHandler.getAll(res.locals.user?.id, limit, start)
            res.json(transactions)
        } catch(error) {
            console.error(error)
            res.status(500).json(messages.InternalServerError)
        }
    }

}