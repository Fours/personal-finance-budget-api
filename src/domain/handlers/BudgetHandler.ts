import type { CreateBudget } from "../../dto/request/CreateBudget.ts";
import type IBudgetRepository from "../../repositories/IBudgetRepository.ts";
import ValidationError from "../errors/ValidationError.ts";
import Budget from "../models/Budget.ts";
import type IBudgetHandler from "./IBudgetHandler.ts";

export default class BudgetHandler implements IBudgetHandler {

    private readonly budgetRepo: IBudgetRepository

    constructor(budgetRepo: IBudgetRepository) {
        this.budgetRepo = budgetRepo
    }

    async create(userId: string, dto: CreateBudget): Promise<Budget> {
        const budget = Budget.from(userId, dto)
        const existingBudget = this.budgetRepo.getByCategoryId(userId, budget.categoryId)
        if (existingBudget === null) {
            await this.budgetRepo.create(budget)
            return budget
        } else {
            throw new ValidationError("There already exists a budget for that cateogry")
        }
    }

    async getAll(userId: string, limit?: number, start?: number): Promise<Budget[]> {
        return this.budgetRepo.getAll(userId, limit, start)
    }
}