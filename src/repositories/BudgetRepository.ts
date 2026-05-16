import { PrismaClient } from "@prisma/client/extension";
import Budget from "../domain/models/Budget.ts";
import type IBudgetRepository from "./IBudgetRepository.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed.ts";
import NotFound from "../domain/errors/NotFound.ts";
import { DB_DEFAULT_LIMIT } from "../lib/constants.ts";

export default class BudgetRepository implements IBudgetRepository {

    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }
    
    async create(budget: Budget): Promise<Budget> {
        try {
            await this.prisma.budget.create({
                data: budget
            })
            return budget
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {            
                throw new UniqueConstraintFailed("A unique constraint was violated")
            } else if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
                throw new ForeignConstraintFailed("A foreign key constraint was violated")
            } else {
                throw error
            }
        }
    }

    async update(id: string, userId: string, categoryId?: string, limit?: number, rollover?: boolean): Promise<Budget> {
        const updateObj: Record<string, any> = {}
        if (categoryId !== undefined) updateObj["categoryId"] = categoryId;
        if (limit !== undefined) updateObj["limit"] = limit;
        if (rollover !== undefined) updateObj["rollover"] = rollover;
        try {
            const budget = await this.prisma.budget.update({
                where: { id: id, userId: userId },
                data: updateObj
            })
            return budget
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
                throw new ForeignConstraintFailed("A foreign key constraint was violated")
            } else if(error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new NotFound("No budget found")
            } else {
                throw error
            }
        }
    }

    async getByCategoryId(userId: string, categoryId: string): Promise<Budget | null> {
        const budgets = await this.prisma.budget.findMany({
            where: { userId: userId, categoryId: categoryId }
        })
        if (budgets.length > 0) {
            return null
        } else {
            return budgets[0]
        }
    }

    async getAll(userId: string, limit: number = DB_DEFAULT_LIMIT, start: number = 0): Promise<Budget[]> {
        const budgets = this.prisma.budget.findMany({
            where: { userId: userId },
            take: limit,
            skip: start,
            orderBy: { id: 'asc' }
        })
        return budgets
    }

    async delete(id: string, userId: string): Promise<void> {
        try {
            await this.prisma.budget.delete({
                where: { id: id, userId: userId }
            })
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new NotFound("Budget was not found")
            } else {
                throw error
            }
        }
    }
}