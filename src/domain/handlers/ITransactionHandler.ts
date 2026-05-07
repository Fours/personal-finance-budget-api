import type Transaction from "../models/Transaction";

export default interface ITransactionHandler {

    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>
}