
import type { PrismaClient } from "@prisma/client/extension";
import type User from "../domain/models/User";
import type IUserRepository from "./IUserRepository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed.ts";

export default class UserRepository implements IUserRepository {
    
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async create(user: User): Promise<User> {        
        try {
            await this.prisma.user.create({
                data: user
            })
            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {                
                throw new UniqueConstraintFailed(error.message)
            } else {
                throw error
            }
        }
    }

    getOne(userId: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    }

    getOneByEmail(email: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }
    
    getAll(limit: number = 50, start: number = 0): Promise<User[]> {
        return this.prisma.user.findMany({
            take: limit,
            skip: start,
            orderBy: { email: 'asc' }
        })
    }

}