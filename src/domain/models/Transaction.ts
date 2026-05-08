import { CreateTransaction } from "../../dto/request/CreateTransaction"
import ValidationError from "../errors/ValidationError"
import validateUUID from "../../lib/validateUUID"
import validateDate from "../../lib/validateDate"

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
        const account = typeof dto.account === "string" ? dto.account : ""
        if (account === ""){
            throw new ValidationError("Transaction account must be a non-empty string")
        }
        // todo
        return new Transaction(id, "", "", "", "", 0, "", "", "")
    }
}