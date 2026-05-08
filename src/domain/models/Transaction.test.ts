import { CreateTransaction } from "../../dto/request/CreateTransaction"
import ValidationError from "../errors/ValidationError"
import Transaction from "./Transaction"

describe("Transaction", () => {

    describe("from", () => {

        const uuid = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
        const date = "2026-05-08"
        const merchant = "merchant"
        const account = "account"

        // id validation
        
        it ("should fail with ValidationError when id is not a string", () => {            
            const dto: CreateTransaction = { id: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction id must be a uuid")
                }                
            }
        })

        it ("should fail with ValidationError when id is not a valid uuid", () => {            
            const dto: CreateTransaction = { id: "not a uuid" }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction id must be a uuid")
                }                
            }
        })

        // userId validation

        // it ("should fail with ValidationError when userId is not a string", () => {            
        //     const dto: CreateTransaction = { id: uuid, userId: 1 } as unknown as CreateTransaction
        //     try {
        //         Transaction.from(dto)
        //         throw new Error("test failed")
        //     } catch (error) {
        //         expect(error instanceof ValidationError).toBe(true)
        //         if (error instanceof ValidationError) {
        //             expect(error.message).toBe("Transaction userId must be a uuid")
        //         }                
        //     }
        // })

        // it ("should fail with ValidationError when userId is not a valid uuid", () => {            
        //     const dto: CreateTransaction = { id: uuid, userId: "not a uuid" }
        //     try {
        //         Transaction.from(dto)
        //         throw new Error("test failed")
        //     } catch (error) {
        //         expect(error instanceof ValidationError).toBe(true)
        //         if (error instanceof ValidationError) {
        //             expect(error.message).toBe("Transaction userId must be a uuid")
        //         }                
        //     }
        // })

        // date validation

        it ("should fail with ValidationError when date is not a string", () => {            
            const dto: CreateTransaction = { id: uuid, userId: uuid, date: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date must be a valid date with the format YYYY-MM-DD")
                }                
            }
        })

        it ("should fail with ValidationError when date is not in the format YYYY-MM-DD", () => {            
            const dto: CreateTransaction = { id: uuid, date: "not a date" }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date must be a valid date with the format YYYY-MM-DD")
                }                
            }
        })

        // merchant validation

        it ("should fail with ValidationError when merchant is not a string", () => {            
            const dto: CreateTransaction = { id: uuid, date: date, merchant: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction merchant must be a non-empty string")
                }                
            }
        })

        it ("should fail with ValidationError when merchant is an empty string", () => {            
            const dto: CreateTransaction = { id: uuid, date: date, merchant: "" }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction merchant must be a non-empty string")
                }                
            }
        })

        // note validation

        it ("should fail with ValidationError when note is not a string", () => {            
            const dto: CreateTransaction = { id: uuid, date: date, merchant: merchant, note: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction note must be a string - it can be empty")
                }                
            }
        })

        // ammount validation

        it ("should fail with ValidationError when ammount is not a number", () => {            
            const dto: CreateTransaction = { 
                id: uuid,
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: "not a number" 
            } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction ammount must be a non-zero number")
                }                
            }
        })

        it ("should fail with ValidationError when ammount is zero", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 0
            }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction ammount must be a non-zero number")
                }                
            }
        })

        // categoryId validation

        it ("should fail with ValidationError when categoryId is not a string", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: 1 
            } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction categoryId must be a uuid")
                }                
            }
        })

        it ("should fail with ValidationError when categoryId is not a valid uuid", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: "not a uuid"
            }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction categoryId must be a uuid")
                }                
            }
        })

        // account validation

        it ("should fail with ValidationError when account is not a string", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: uuid,
                account: 1 
            } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction account must be a non-empty string")
                }                
            }
        })

        it ("should fail with ValidationError when account an empty string", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: uuid,
                account: "" 
            }
            
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction account must be a non-empty string")
                }                
            }
        })

        // kind validation

        it ("should fail with ValidationError when kind is not a string", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: uuid,
                account: account,
                kind: 1
            } as unknown as CreateTransaction
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction kind must be one of [expense, income, transfer]")
                }                
            }
        })

        it ("should fail with ValidationError when kind is not one of the valid values", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: uuid,
                account: account,
                kind: "invalid string"
            }
            try {
                Transaction.from(uuid, dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction kind must be one of [expense, income, transfer]")
                }                
            }
        })

        // success cases

        it ("should return Transaction when all properties are valid", () => {            
            const dto: CreateTransaction = { 
                id: uuid, 
                date: date, 
                merchant: merchant, 
                note: "", 
                amount: 1,
                categoryId: uuid,
                account: account,
                kind: "expense"
            }
            const transaction = Transaction.from(uuid, dto)
            expect(transaction).toEqual(new Transaction(uuid, uuid, date, merchant, "", 1, uuid, account, "expense"))
        })

    })
})