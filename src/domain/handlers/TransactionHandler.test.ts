import type { CreateTransaction } from "../../dto/request/CreateTransaction"
import type { UpdateTransaction } from "../../dto/request/UpdateTransaction"
import ITransactionRepository from "../../repositories/ITransactionRepository"
import ValidationError from "../errors/ValidationError"
import Transaction from "../models/Transaction"
import TransactionHandler from "./TransactionHandler"

describe("TransactionHandler", () => {

    class FakeTransactionRepository implements ITransactionRepository {
        create(transaction: Transaction): Promise<Transaction> {
            throw new Error("Method not implemented.")
        }
        update(id: string, userId: string, date?: string, merchant?: string, note?: string, amount?: number, categoryId?: string): Promise<Transaction> {
            throw new Error("Method not implemented.")
        }
        getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]> {
            throw new Error("Method not implemented.")
        }
        delete(id: string, userId: string): Promise<void> {
            throw new Error("Method not implemented.")
        }
    }

    let fakeRepo: FakeTransactionRepository
    let transactionHandler: TransactionHandler
    
    beforeEach(() => {
        fakeRepo = new FakeTransactionRepository()
        transactionHandler = new TransactionHandler(fakeRepo)
    })
    
    describe("create", () => {

        // note: Transacation.from is tested in Transaction.test.ts

        it("should create the new transaction", async () => {
            const uuid = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 100, "ctgId", "acnt", "kind")
            const createSpy = jest.spyOn(fakeRepo, "create").mockResolvedValue(transaction)
            const dto: CreateTransaction = {
                id: uuid,
                date: "2026-05-24",
                merchant: "dto-merchant",
                note: "dto-note",
                amount: 200,
                categoryId: uuid,
                account: "dto-account",
                kind: "expense"
            }
            const result = await transactionHandler.create("userId", dto)
            expect(result).toBe(transaction)
            expect(createSpy.mock.calls.length).toBe(1)
            const created = createSpy.mock.calls[0][0]
            expect(created.id).toBe(dto.id)
            expect(created.date).toBe(dto.date)
            expect(created.merchant).toBe(dto.merchant)
            expect(created.note).toBe(dto.note)
            expect(created.amount).toBe(dto.amount)
            expect(created.categoryId).toBe(dto.categoryId)
            expect(created.account).toBe(dto.account)
            expect(created.kind).toBe(dto.kind)
        })
    })

    describe("update", () => {

        it("when date is provided but not a string should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: 1 } as unknown as UpdateTransaction
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date, if provided, must be a string in the format 'YYYY-MM-DD'")
                }
            }
        })

        it("when date is a string but not the correct format should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "test date" }
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction date, if provided, must be a string in the format 'YYYY-MM-DD'")
                }
            }
        })

        it("when merchant is provided but not a string should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: 1 } as unknown as UpdateTransaction
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction merchant, if provided, must be a non-empty string")
                }
            }
        })

        it("when merchant is an empty string should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "" }
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction merchant, if provided, must be a non-empty string")
                }
            }
        })

        it("when note is provided but not a string should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: 1 } as unknown as UpdateTransaction
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction note, if provided, must be a string")
                }
            }
        })

        it("when amount is provided but not a number should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: "", amount: true } as unknown as UpdateTransaction
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction amount, if provided, must be a non-zero number")
                }
            }
        })

        it("when amount is 0 should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: "", amount: 0 }
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction amount, if provided, must be a non-zero number")
                }
            }
        })

        it("when categoryId is provided but not a string should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: "", amount: 1, categoryId: 1 } as unknown as UpdateTransaction
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction categoryId, if provided, must be a valid UUID")
                }
            }
        })

        it("when categoryId is not a uuid should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: "", amount: 1, categoryId: "not a uuid" }
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Transaction categoryId, if provided, must be a valid UUID")
                }
            }
        })

        it("when all properties are undefined should fail with a ValidationError", async () => {
            const dto: UpdateTransaction = {}
            try {
                const result = await transactionHandler.update("id", "userId", dto)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Must provide one or more transaction properties")
                }
            }
        })

        it("should succeed and update a transaction correctly", async () => {
            const dto: UpdateTransaction = { date: "2026-05-25", merchant: "merchant", note: "", amount: 1, categoryId: "5d6863bd-beec-4e07-bf4f-a39098d1da97" }
            const transaction = new Transaction("id", "userId", "2026-05-25", "merchant", "", 1, "ctgId", "account", "kind")
            const spyUpdate = jest.spyOn(fakeRepo, "update").mockResolvedValue(transaction)            
            const result = await transactionHandler.update("id", "userId", dto)
            expect(result).toBe(transaction)
            expect(spyUpdate.mock.calls.length).toBe(1)
            const params = spyUpdate.mock.calls[0]
            expect(params[0]).toBe("id")
            expect(params[1]).toBe("userId")
            expect(params[2]).toBe("2026-05-25")
            expect(params[3]).toBe("merchant")
            expect(params[4]).toBe("")
            expect(params[5]).toBe(1)
            expect(params[6]).toBe("5d6863bd-beec-4e07-bf4f-a39098d1da97")
        })

        it("when only one property is provided should succeed and update a transaction correctly", async () => {
            const dto: UpdateTransaction = { note: "note" }
            const transaction = new Transaction("id", "userId", "2026-05-25", "merchant", "note", 1, "ctgId", "account", "kind")
            const spyUpdate = jest.spyOn(fakeRepo, "update").mockResolvedValue(transaction)            
            const result = await transactionHandler.update("id", "userId", dto)
            expect(result).toBe(transaction)
            expect(spyUpdate.mock.calls.length).toBe(1)
            const params = spyUpdate.mock.calls[0]
            expect(params[0]).toBe("id")
            expect(params[1]).toBe("userId")
            expect(params[2]).toBeUndefined()
            expect(params[3]).toBeUndefined()
            expect(params[4]).toBe("note")
            expect(params[5]).toBeUndefined()
            expect(params[6]).toBeUndefined()
        })
    })

    describe("getAll", () => {


        
    })

    describe("delete", () => {


        
    })
})