import type { Request, Response } from "express";
import type ICategoryHandler from "../domain/handlers/ICategoryHandler"
import type Category from "../domain/models/Category"
import { type Message } from "../dto/response/Message.ts"
import errorResponses from "../lib/errorResponses.ts";

export default class CategoryController {

    private readonly categoryHandler: ICategoryHandler

    constructor(categoryHandler: ICategoryHandler) {
        this.categoryHandler = categoryHandler
    }

    async getAll(req: Request, res: Response<Category[] | Message>): Promise<void> {
        try {
            const categories = await this.categoryHandler.getAll()
            res.json(categories)
        } catch(error) {
            errorResponses(res, error)
        }
    }
}