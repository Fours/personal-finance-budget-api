import { CreateTransaction } from "../../dto/request/CreateTransaction"
import ValidationError from "../errors/ValidationError"
import Transaction from "./Transaction"

describe("Transaction", () => {

    describe("from", () => {

        const uuid = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
        const date = "2026-05-08"

        // id validation
        
        it ("should fail with ValidationError when id is not a string", () => {            
            const dto: CreateTransaction = { id: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction id must be a uuid")
                }                
            }
        })

        it ("should fail with ValidationError when id is not a valid uuid", () => {            
            const dto: CreateTransaction = { id: "" }
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction id must be a uuid")
                }                
            }
        })

        // userId validation

        it ("should fail with ValidationError when userId is not a string", () => {            
            const dto: CreateTransaction = { id: uuid, userId: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction userId must be a uuid")
                }                
            }
        })

        it ("should fail with ValidationError when userId is not a valid uuid", () => {            
            const dto: CreateTransaction = { id: uuid, userId: "" }
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction userId must be a uuid")
                }                
            }
        })

        // date validation

        it ("should fail with ValidationError when date is not a string", () => {            
            const dto: CreateTransaction = { id: uuid, userId: uuid, date: 1 } as unknown as CreateTransaction
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date must be a valid date with the format YYYY-MM-DD")
                }                
            }
        })

        it ("should fail with ValidationError when date is not in the format YYYY-MM-DD", () => {            
            const dto: CreateTransaction = { id: uuid, userId: uuid, date: "not a date" }
            try {
                Transaction.from(dto)
                throw new Error("test failed")
            } catch (error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date must be a valid date with the format YYYY-MM-DD")
                }                
            }
        })

        // merchant validation

        // note validation

        // ammount validation

        // categoryId validation

        // account validation

        // it ("should fail with ValidationError when account is not a string", () => {            
        //     const dto: CreateTransaction = { id: uuid, userId: uuid, account: 1 } as unknown as CreateTransaction
        //     try {
        //         Transaction.from(dto)
        //         throw new Error("test failed")
        //     } catch (error) {
        //         expect(error instanceof ValidationError).toBe(true)
        //         if (error instanceof ValidationError) {
        //             expect(error.message).toBe("Transaction account must be a non-empty string")
        //         }                
        //     }
        // })

        // it ("should fail with ValidationError when account an empty string", () => {            
        //     const dto: CreateTransaction = { id: uuid, userId: uuid, account: "" }
        //     try {
        //         Transaction.from(dto)
        //         throw new Error("test failed")
        //     } catch (error) {
        //         expect(error instanceof ValidationError).toBe(true)
        //         if (error instanceof ValidationError) {
        //             expect(error.message).toBe("Transaction account must be a non-empty string")
        //         }                
        //     }
        // })

        // kind validation
    })
})