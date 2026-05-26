import type { PrismaClient } from "@prisma/client/extension";
import type Transaction from "../domain/models/Transaction";
import type ITransactionRepository from "./ITransactionRepository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed.ts";
import NotFound from "../domain/errors/NotFound.ts";
import { DB_DEFAULT_LIMIT } from "../lib/constants.ts";

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

    async update(id: string, userId: string, date?: string, merchant?: string, note?: string, amount?: number, categoryId?: string): Promise<Transaction> {        
        const updateObj: Record<string, any> = {}
        if (date !== undefined) updateObj["date"] = date;
        if (merchant !== undefined) updateObj["merchant"] = merchant;
        if (note !== undefined) updateObj["note"] = note;
        if (amount !== undefined) updateObj["amount"] = amount;
        if (categoryId !== undefined) updateObj["categoryId"] = categoryId;
        try {
            const transaction = await this.prisma.transaction.update({
                where: { id: id, userId: userId },
                data: updateObj,
            });
            return transaction;
        } catch (error) {            
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
                throw new ForeignConstraintFailed("Must provide a valid existing categoryId")
            } else if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new NotFound("Transaction was not found")
            } else {
                throw error
            }
        }        
    }
    
    getAll(userId: string, limit: number = DB_DEFAULT_LIMIT, start: number = 0): Promise<Transaction[]> {
        return this.prisma.transaction.findMany({
            where: { userId: userId },
            take: limit,
            skip: start,
            orderBy: { date: 'desc' }
        })
    }

    async delete(id: string, userId: string): Promise<void> {
        try {
            await this.prisma.transaction.delete({
                where: { id: id, userId: userId }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new NotFound("Transaction was not found")
            } else {
                throw error
            }
        }
    }
}