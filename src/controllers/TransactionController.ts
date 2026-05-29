import type { Request, Response } from "express";
import type ITransactionHandler from "../domain/handlers/ITransactionHandler";
import { type Message } from "../dto/response/Message.ts";
import type { CreateTransaction } from "../dto/request/CreateTransaction.ts";
import Transaction from "../domain/models/Transaction.ts";
import type { UpdateTransaction } from "../dto/request/UpdateTransaction.ts";
import validateUUID from "../lib/validateUUID.ts";
import errorResponses from "../lib/errorResponses.ts";

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
            errorResponses(res, error)
        }
    }

    async update(req: Request<{ id: string }, unknown, UpdateTransaction>, res: Response<Transaction | Message>): Promise<void> {
        const transactionId = req.params.id
        if (!validateUUID(transactionId)) {
            res.status(400).json({ message: "Transaction id must be a valid UUID" })
            return
        }        
        try {
            const updated = await this.transactionHandler.update(transactionId, res.locals.user?.id, req.body)
            res.json(updated)
        } catch(error) {            
            errorResponses(res, error)
        }
    }

    async getAll(req: Request<{}, unknown, { limit?: string, start?: string }>, res: Response<Transaction[] | Message>): Promise<void> {

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
            errorResponses(res, error)
        }
    }

    async delete(req: Request<{ id: string }>, res: Response<Message>): Promise<void> {
        const transactionId = req.params.id
        if (!validateUUID(transactionId)) {
            res.status(400).json({ message: "Transaction id must be a valid UUID" })
            return
        }        
        try {
            const deleted = await this.transactionHandler.delete(transactionId, res.locals.user?.id)
            res.json({ message: "Transaction deleted."})
        } catch(error) {
            errorResponses(res, error)
        }
    }

}