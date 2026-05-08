import type Transaction from "../domain/models/Transaction";

export default interface ITransactionRepository {

    create(transaction: Transaction): Promise<Transaction>
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>

}