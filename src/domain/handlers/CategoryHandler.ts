import type ICategoryRepository from "../../repositories/ICategoryRepository";
import type Category from "../models/Category";
import type ICategoryHandler from "./ICategoryHandler";

export default class CategoryHandler implements ICategoryHandler {

    private readonly categoryRepo: ICategoryRepository

    constructor(categoryRepo: ICategoryRepository) {
        this.categoryRepo = categoryRepo
    }

    getAll(): Promise<Category[]> {
        return this.categoryRepo.getAll()
    }
}