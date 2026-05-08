import type { PrismaClient } from "@prisma/client/extension";
import type Transaction from "../domain/models/Transaction";
import type ITransactionRepository from "./ITransactionRepository";

export default class TransactionRepository implements ITransactionRepository {

    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    create(transaction: Transaction): Promise<Transaction> {
        return this.prisma.transaction.create({
            data: transaction
        })
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