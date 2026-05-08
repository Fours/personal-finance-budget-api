import { CreateTransaction } from "../../dto/request/CreateTransaction";
import type ITransactionRepository from "../../repositories/ITransactionRepository";
import type Transaction from "../models/Transaction";
import type ITransactionHandler from "./ITransactionHandler";

export default class TransactionHandler implements ITransactionHandler {
    
    private readonly transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository) {
        this.transactionRepo = transactionRepo
    }

    async create(dto: CreateTransaction): Promise<Transaction> {
        throw new Error("todo")
    }
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]> {
        return this.transactionRepo.getAll(userId, limit, start)
    }

}