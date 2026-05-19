import type { CreateBudget } from "../../dto/request/CreateBudget.ts";
import type { UpdateBudget } from "../../dto/request/UpdateBudget.ts";
import Budget from "../models/Budget.ts";

export default interface IBudgetHandler {

    create(userId: string, dto: CreateBudget): Promise<Budget>

    getAll(userId: string, limit?: number, start?: number): Promise<Budget[]>

    update(id: string, userId: string, dto: UpdateBudget): Promise<Budget>

    delete(id: string, userId: string): Promise<void>
}