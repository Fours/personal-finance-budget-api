import type Transaction from "../domain/models/Transaction";

export default interface ITransactionRepository {

    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>

}