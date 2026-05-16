import type { CreateBudget } from "../../dto/request/CreateBudget.ts"
import validateUUID from "../../lib/validateUUID.ts"
import ValidationError from "../errors/ValidationError.ts"

export default class Budget {

    readonly id: string
    readonly userId: string
    readonly categoryId: string
    readonly limit: number
    readonly rollover: boolean

    constructor(id: string, userId: string, categoryId: string, limit: number, rollover: boolean) {
        this.id = id
        this.userId = userId
        this.categoryId = categoryId
        this.limit = limit
        this.rollover = rollover
    }

    static from(userId: string, dto: CreateBudget): Budget {
        const id = typeof dto.id === "string" ? dto.id : ""
        if (!validateUUID(id)) {
            throw new ValidationError("Budget id must be a uuid")
        }
        const categoryId = typeof dto.categoryId === "string" ? dto.categoryId : ""
        if (!validateUUID(categoryId)) {
            throw new ValidationError("CategoryId id must be a uuid")
        }
        const limit = typeof dto.limit === "number" ? dto.limit : 0
        if (limit < 1) {
            throw new ValidationError("Limit must be a number greater than 0")
        }
        const rollover = typeof dto.rollover === "boolean" ? dto.rollover : false

        return new Budget(id, userId, categoryId, limit, rollover)
    }
}