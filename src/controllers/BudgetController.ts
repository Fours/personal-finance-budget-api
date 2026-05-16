import type { Request, Response } from "express"
import type IBudgetHandler from "../domain/handlers/IBudgetHandler.ts";
import type { CreateBudget } from "../dto/request/CreateBudget.ts";
import errorResponses from "../lib/errorResponses.ts";

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
}