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
}