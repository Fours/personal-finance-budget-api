import type { Request, Response } from "express"
import type IBudgetHandler from "../domain/handlers/IBudgetHandler.ts";
import type { CreateBudget } from "../dto/request/CreateBudget.ts";
import errorResponses from "../lib/errorResponses.ts";
import type Budget from "../domain/models/Budget.ts";
import type { Message } from "../dto/response/Message.ts";
import type { UpdateBudget } from "../dto/request/UpdateBudget.ts";

export default class BudgetController {

    private readonly budgetHandler: IBudgetHandler

    constructor(budgetHandler: IBudgetHandler) {
        this.budgetHandler = budgetHandler
    }

    async create(req: Request<CreateBudget>, res: Response): Promise<void> {
        try {  
            const budget = await this.budgetHandler.create(res.locals.user?.id, req.body)
            res.json(budget)
        } catch(error) {
            errorResponses(res, error)
        }
    }

    async getAll(req: Request<{}, unknown, { limit?: string, start?: string }>, res: Response<Budget[] | Message>): Promise<void> {
    
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
            const transactions = await this.budgetHandler.getAll(res.locals.user?.id, limit, start)
            res.json(transactions)
        } catch(error) {
            errorResponses(res, error)
        }
    }

    async update(req: Request<{id: string}, unknown, UpdateBudget>, res: Response<Budget | Message>): Promise<void> {
        try {
            const budget = await this.budgetHandler.update(req.params.id, res.locals.user?.id, req.body)
            res.json(budget)
        } catch(error) {
            errorResponses(res, error)
        }
    }

    async delete(req: Request<{id: string}>, res: Response<Message>): Promise<void> {
        try {
            await this.budgetHandler.delete(req.params.id, res.locals.user?.id)
            res.json({ message: "Budget deleted" })
        } catch(error) {
            errorResponses(res, error)
        }
    }
}