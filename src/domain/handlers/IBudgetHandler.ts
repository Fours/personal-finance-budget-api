import type { CreateBudget } from "../../dto/request/CreateBudget.ts";
import Budget from "../models/Budget.ts";

export default interface IBudgetHandler {

    create(userId: string, dto: CreateBudget): Promise<Budget>
}