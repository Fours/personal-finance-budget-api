
import type { PrismaClient } from "@prisma/client/extension";
import type User from "../domain/models/User";
import type IUserRepository from "./IUserRepository";

export default class UserRepository implements IUserRepository {
    
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    create(user: User): Promise<User> {
        return this.prisma.user.create({
            data: user
        })
    }

    getOne(userId: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: userId
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