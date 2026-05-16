import Budget from "../domain/models/Budget.ts";

export default interface IBudgetRepository {

    create(budget: Budget): Promise<Budget>

    update(id: string, userId: string, categoryId?: string, limit?: number, rollover?: boolean): Promise<Budget>

    getByCategoryId(userId: string, categoryId: string): Promise<Budget | null>
    
    getAll(userId: string): Promise<Budget[]>

    delete(id: string, userId: string): Promise<void>
}