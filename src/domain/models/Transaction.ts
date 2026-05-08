import type { CreateTransaction } from "../../dto/request/CreateTransaction.ts"
import ValidationError from "../errors/ValidationError.ts"
import validateUUID from "../../lib/validateUUID.ts"
import validateDate from "../../lib/validateDate.ts"

export default class Transaction {

    readonly id: string
    readonly userId: string
    readonly date: string
    readonly merchant: string
    readonly note: string
    readonly amount: number
    readonly categoryId: string
    readonly account: string
    readonly kind: string

    constructor(
        id: string, 
        userId: string, 
        date: string, 
        merchant: string, 
        note: string, 
        amount: number, 
        categoryId: string,
        account: string,
        kind: string
    ) {
        this.id = id
        this.userId = userId
        this.date = date
        this.merchant = merchant
        this.note = note
        this.amount = amount
        this.categoryId = categoryId
        this.account = account
        this.kind = kind
    }

    static from(dto: CreateTransaction): Transaction {        
        const id = typeof dto.id === "string" ? dto.id : ""
        if (!validateUUID(id)) {
            throw new ValidationError("Transaction id must be a uuid")
        }
        const userId = typeof dto.userId === "string" ? dto.userId : ""
        if (!validateUUID(userId)) {
            throw new ValidationError("Transaction userId must be a uuid")
        }
        const date = typeof dto.date === "string" ? dto.date : ""
        if(!validateDate(date)) {
            throw new ValidationError("Transaction date must be a valid date with the format YYYY-MM-DD")
        }
        const merchant = typeof dto.merchant === "string" ? dto.merchant : ""
        if (merchant === ""){
            throw new ValidationError("Transaction merchant must be a non-empty string")
        }
        if (typeof dto.note !== "string"){
            throw new ValidationError("Transaction note must be a string - it can be empty")
        }
        const amount = typeof dto.amount === "number" ? dto.amount : 0
        if (amount === 0) {
            throw new ValidationError("Transaction ammount must be a non-zero number")
        }
        const categoryId = typeof dto.categoryId === "string" ? dto.categoryId : ""
        if (!validateUUID(categoryId)) {
            throw new ValidationError("Transaction categoryId must be a uuid")
        }
        const account = typeof dto.account === "string" ? dto.account : ""
        if (account === ""){
            throw new ValidationError("Transaction account must be a non-empty string")
        }
        const kind = typeof dto.kind === "string" ? dto.kind : ""
        if(kind !== "expense" && kind !== "income" && kind !== "transfer") {
            throw new ValidationError("Transaction kind must be one of [expense, income, transfer]")
        }
        
        return new Transaction(id, userId, date, merchant, dto.note, amount, categoryId, account, kind)
    }
}