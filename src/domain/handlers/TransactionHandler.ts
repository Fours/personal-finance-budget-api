import type { CreateTransaction } from "../../dto/request/CreateTransaction.ts";
import type { UpdateTransaction } from "../../dto/request/UpdateTransaction.ts";
import validateDate from "../../lib/validateDate.ts";
import validateUUID from "../../lib/validateUUID.ts";
import type ITransactionRepository from "../../repositories/ITransactionRepository";
import ValidationError from "../errors/ValidationError.ts";
import Transaction from "../models/Transaction.ts";
import type ITransactionHandler from "./ITransactionHandler";

export default class TransactionHandler implements ITransactionHandler {
    
    private readonly transactionRepo: ITransactionRepository

    constructor(transactionRepo: ITransactionRepository) {
        this.transactionRepo = transactionRepo
    }

    create(userId: string, dto: CreateTransaction): Promise<Transaction> {
        const transaction = Transaction.from(userId, dto)
        return this.transactionRepo.create(transaction)
    }

    async update(id: string, dto: UpdateTransaction): Promise<Transaction> {
        this.validateUpdate(dto)
        return this.transactionRepo.update(id, dto.date, dto.merchant, dto.note, dto.amount, dto.categoryId)
    }
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]> {
        return this.transactionRepo.getAll(userId, limit, start)
    }

    delete(id: string, userId: string): Promise<void> {
        return this.transactionRepo.delete(id, userId)
    }

    private validateUpdate(dto: UpdateTransaction): void {
        if (dto.date !== undefined && (typeof dto.date !== "string" || !validateDate(dto.date))) {
            throw new ValidationError("Transaction date, if provided, must be a string in the format 'YYYY-MM-DD'")
        }
        if (dto.merchant !== undefined && (typeof dto.merchant !== "string" || dto.merchant === "")) {
            throw new ValidationError("Transaction merchant, if provided, must be a non-empty string")
        }
        if (dto.note !== undefined && typeof dto.note !== "string") {
            throw new ValidationError("Transaction note, if provided, must be a string")
        }
        if (dto.amount !== undefined && (typeof dto.amount !== "number" || dto.amount === 0)) {
            throw new ValidationError("Transaction amount, if provided, must be a non-zero number")
        }
        if (dto.categoryId !== undefined && (typeof dto.categoryId !== "string" || !validateUUID(dto.categoryId))) {
            throw new ValidationError("Transaction categoryId, if provided, must be a valid UUID")
        }
    }

}