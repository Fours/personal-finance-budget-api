import type Transaction from "../domain/models/Transaction";

export default interface ITransactionRepository {

    create(transaction: Transaction): Promise<Transaction>

    update(id: string, userId: string, date?: string, merchant?: string, note?: string, amount?: number, categoryId?: string, account?: string, kind?: string): Promise<Transaction>
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>

    delete(id: string, userId: string): Promise<void>

}