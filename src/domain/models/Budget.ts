export default class Budget {

    private readonly id: string
    private readonly userId: string
    private readonly categoryId: string
    private readonly limit: number
    private readonly rollover: boolean

    constructor(id: string, userId: string, categoryId: string, limit: number, rollover: boolean) {
        this.id = id
        this.userId = userId
        this.categoryId = categoryId
        this.limit = limit
        this.rollover = rollover
    }
}