import type { PrismaClient } from "@prisma/client/extension";
import type Transaction from "../domain/models/Transaction";
import type ITransactionRepository from "./ITransactionRepository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed.ts";

export default class TransactionRepository implements ITransactionRepository {

    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async create(transaction: Transaction): Promise<Transaction> {
        try {
            await this.prisma.transaction.create({
                data: transaction
            })
            return transaction
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {            
                throw new UniqueConstraintFailed(error.message)
            } else if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
                throw new ForeignConstraintFailed("A foreign key constraint was violated")
            } else {
                throw error
            }
        }
    }
    
    getAll(userId: string, limit: number = 50, start: number = 0): Promise<Transaction[]> {
        return this.prisma.transaction.findMany({
            where: { userId: userId },
            take: limit,
            skip: start,
            orderBy: { date: 'desc' }
        })
    }
}