export type CreateTransaction = {
    id?: string, 
    userId?: string, 
    date?: string, 
    merchant?: string, 
    note?: string, 
    amount?: number, 
    categoryId?: string,
    account?: string,
    kind?: string
}