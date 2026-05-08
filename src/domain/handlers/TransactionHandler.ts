import type { CreateTransaction } from "../../dto/request/CreateTransaction.ts";
import type ITransactionRepository from "../../repositories/ITransactionRepository";
import Transaction from "../models/Transaction.ts";
import type ITransactionHandler from "./ITransactionHandler";

export default class TransactionHandler implements ITransactionHandler {
    
    private readonly transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository) {
        this.transactionRepo = transactionRepo
    }

    async create(dto: CreateTransaction): Promise<Transaction> {
        const transaction = Transaction.from(dto)
        return this.transactionRepo.create(transaction)
    }
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]> {
        return this.transactionRepo.getAll(userId, limit, start)
    }

}