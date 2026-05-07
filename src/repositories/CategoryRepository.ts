import type { PrismaClient } from "@prisma/client/extension";
import type Category from "../domain/models/Category";
import type ICategoryRepository from "./ICategoryRepository";

export default class CategoryRepository implements ICategoryRepository {

    private readonly prisma: PrismaClient
    
    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }
    
    getAll(): Promise<Category[]> {
        return this.prisma.category.findMany({})
    }
}