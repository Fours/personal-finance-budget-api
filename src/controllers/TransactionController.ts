import type { Request, Response } from "express";
import type ITransactionHandler from "../domain/handlers/ITransactionHandler";
import { type Message, messages } from "../dto/response/Message.ts";
import type { CreateTransaction } from "../dto/request/CreateTransaction.ts";
import ValidationError from "../domain/errors/ValidationError.ts";
import Transaction from "../domain/models/Transaction.ts";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed.ts";
import type { UpdateTransaction } from "../dto/request/UpdateTransaction.ts";
import validateUUID from "../lib/validateUUID.ts";

export default class TransactionController {

    private readonly transactionHandler: ITransactionHandler

    constructor(transactionHandler: ITransactionHandler) {
        this.transactionHandler = transactionHandler
    }

    async create(req: Request<CreateTransaction>, res: Response<Transaction | Message>): Promise<void> {
        try {
            const transaction = await this.transactionHandler.create(res.locals.user?.id, req.body)
            res.json(transaction)
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: `${error.name}: ${error.message}` })
            } else if (error instanceof UniqueConstraintFailed) {
                res.status(400).json({ message: `${error.name}: Transaction id must be unique` })
            } else if (error instanceof ForeignConstraintFailed) {
                res.status(400).json({ message: `${error.name}: ${error.message}` })
            } else {
                console.error(error)
                res.status(500).json(messages.InternalServerError)
            }
        }
    }

    async update(req: Request<{ id: string }, unknown, UpdateTransaction>, res: Response<Transaction | Message>): Promise<void> {
        const transactionId = req.params.id
        if (!validateUUID(transactionId)) {
            res.status(400).json({ message: "Transaction id must be a valid UUID" })
            return
        }        
        try {
            const updated = await this.transactionHandler.update(transactionId, req.body)
            res.json(updated)
        } catch(error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: `${error.name}: ${error.message}` })
            } else if (error instanceof ForeignConstraintFailed) {
                res.status(400).json({ message: `${error.name}: ${error.message}` })
            } else {
                console.error(error)
                res.status(500).json(messages.InternalServerError)
            }
        }
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