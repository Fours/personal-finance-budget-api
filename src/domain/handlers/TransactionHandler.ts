import type ITransactionRepository from "../../repositories/ITransactionRepository";
import type Transaction from "../models/Transaction";
import type ITransactionHandler from "./ITransactionHandler";

export default class TransactionHandler implements ITransactionHandler {
    
    private readonly transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository) {
        this.transactionRepo = transactionRepo
    }
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]> {
        return this.transactionRepo.getAll(userId, limit, start)
    }

}