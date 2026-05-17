import type { CreateBudget } from "../../dto/request/CreateBudget.ts";
import type { UpdateBudget } from "../../dto/request/UpdateBudget.ts";
import validateUUID from "../../lib/validateUUID.ts";
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
        const existingBudget = await this.budgetRepo.getByCategoryId(userId, budget.categoryId)
        if (existingBudget === null) {
            await this.budgetRepo.create(budget)
            return budget
        } else {
            throw new ValidationError("There already exists a budget for that cateogry.")
        }
    }

    async getAll(userId: string, limit?: number, start?: number): Promise<Budget[]> {
        return this.budgetRepo.getAll(userId, limit, start)
    }

    async update(id: string, userId: string, dto: UpdateBudget): Promise<Budget> {
        this.validateUpdate(dto)
        // exclude the user from creating 2 budgets for same ctg
        if (dto.categoryId) {
            const existingBudget = await this.budgetRepo.getByCategoryId(userId, dto.categoryId)
            if (existingBudget === null || existingBudget.id === id) {
                return this.budgetRepo.update(id, userId, dto.categoryId, dto.limit, dto.rollover)
            } else {
                throw new ValidationError("Can not have two budgets for the same category.")
            }
        } else {
            return this.budgetRepo.update(id, userId, dto.categoryId, dto.limit, dto.rollover)
        }
    }

    private validateUpdate(dto: UpdateBudget): void {
        if (!dto) {
            throw new ValidationError("Update budget body is required.")
        }
        if (dto.categoryId !== undefined && (typeof dto.categoryId !== "string" || !validateUUID(dto.categoryId))) {
            throw new ValidationError("Budget cateegoryId, if provided, must be a valid UUID.")
        }
        if (dto.limit !== undefined && (typeof dto.limit !== "number" || dto.limit < 1)) {
            throw new ValidationError("Budget limit, if provided, must be a positive number.")
        }
        if (dto.rollover !== undefined && typeof dto.rollover !== "boolean") {
            throw new ValidationError("Budget rollover, if provided, must be a boolean.")
        }
    }
}