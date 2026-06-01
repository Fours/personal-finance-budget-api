import type { PrismaClient } from "@prisma/client/extension";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { DB_DEFAULT_LIMIT } from "../lib/constants";
import TransactionRepository from "./TransactionRepository";
import Transaction from "../domain/models/Transaction";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed";
import NotFound from "../domain/errors/NotFound";

describe("TransactionRepository", () => {

    let prisma: PrismaClient
    let transactionRepo: TransactionRepository

    beforeEach(() => {
        prisma = {
            transaction: {
                create: () => { return Promise.reject(new Error("not implimented")) },
                update: () => { return Promise.reject(new Error("not implimented")) },                
                findMany: () => { return Promise.reject(new Error("not implimented")) },
                delete: () => { return Promise.reject(new Error("not implimented")) }
            }
        }
        transactionRepo = new TransactionRepository(prisma)
    })

    describe("create", () => {

        it("When a PrismaClientKnownRequestError with error code P2002 occurs, transform it to UniqueConstraintFailed", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2002", clientVersion: ""})
            jest.spyOn(prisma.transaction, "create").mockRejectedValue(dbError)
            try {
                await transactionRepo.create(transaction)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof UniqueConstraintFailed).toBe(true)
                if (error instanceof UniqueConstraintFailed) {
                    expect(error.message).toBe("test")
                }
            }
        })

        it("When a PrismaClientKnownRequestError with error code P2003 occurs, transform it to ForeignConstraintFailed", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2003", clientVersion: ""})
            jest.spyOn(prisma.transaction, "create").mockRejectedValue(dbError)
            try {
                await transactionRepo.create(transaction)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ForeignConstraintFailed).toBe(true)
                if (error instanceof ForeignConstraintFailed) {
                    expect(error.message).toBe("A foreign key constraint was violated")
                }
            }
        })

        it("when a different db error occurs, should reject with that error", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const dbError = new Error("a different db error")
            jest.spyOn(prisma.transaction, "create").mockRejectedValue(dbError)
            try {
                await transactionRepo.create(transaction)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof Error).toBe(true)
                if (error instanceof Error) {
                    expect(error.message).toBe("a different db error")
                }
            }
        })

        it("Should succeed and return the user", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const createSpy = jest.spyOn(prisma.transaction, "create").mockResolvedValue(transaction)
            const result = await transactionRepo.create(transaction)
            expect(result).toEqual(transaction)
            expect(createSpy.mock.calls.length).toBe(1)
            expect(createSpy.mock.calls[0]).toEqual([{ data: transaction }])
        })

    })

    describe("update", () => {

        it("When a PrismaClientKnownRequestError with error code P2003 occurs, transform it to ForeignConstraintFailed", async () => {
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2003", clientVersion: ""})
            jest.spyOn(prisma.transaction, "update").mockRejectedValue(dbError)
            try {
                await transactionRepo.update("id", "userId")
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof ForeignConstraintFailed).toBe(true)
                if (error instanceof ForeignConstraintFailed) {
                    expect(error.message).toBe("Must provide a valid existing categoryId")
                }
            }
        })

        it("When a PrismaClientKnownRequestError with error code P2025 occurs, transform it to NotFound", async () => {
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2025", clientVersion: ""})
            jest.spyOn(prisma.transaction, "update").mockRejectedValue(dbError)
            try {
                await transactionRepo.update("id", "userId")
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof NotFound).toBe(true)
                if (error instanceof NotFound) {
                    expect(error.message).toBe("Transaction was not found")
                }
            }
        })

        it("when a different db error occurs, should reject with that error", async () => {
            const dbError = new Error("a different db error")
            jest.spyOn(prisma.transaction, "update").mockRejectedValue(dbError)
            try {
                await transactionRepo.update("id", "userId")
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof Error).toBe(true)
                if (error instanceof Error) {
                    expect(error.message).toBe("a different db error")
                }
            }
        })

        it("should update a transaction correctly", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const spyUpdate = jest.spyOn(prisma.transaction, "update").mockResolvedValue(transaction)
            const result = await transactionRepo.update("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            expect(result).toBe(transaction)
            expect(spyUpdate.mock.calls.length).toBe(1)
            expect(spyUpdate.mock.calls[0]).toEqual([{
                where: { id: "id", userId: "userId" },
                data: {
                    date: "date",
                    merchant: "merchant",
                    note: "note",
                    amount: 1,
                    categoryId: "ctgId",
                    account: "account",
                    kind: "kind"
                },
            }])
        })

        it("when params are undefined should update a transaction correctly", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const spyUpdate = jest.spyOn(prisma.transaction, "update").mockResolvedValue(transaction)
            const result = await transactionRepo.update("id", "userId")
            expect(result).toBe(transaction)
            expect(spyUpdate.mock.calls.length).toBe(1)
            expect(spyUpdate.mock.calls[0]).toEqual([{
                where: { id: "id", userId: "userId" },
                data: {}
            }])
        })
    })

    describe("getAll", () => {

        it("should get transactions correctly", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const spyFind = jest.spyOn(prisma.transaction, "findMany").mockResolvedValue([transaction])
            const result = await transactionRepo.getAll("userId", 10, 20)
            expect(result).toEqual([transaction])
            expect(spyFind.mock.calls.length).toBe(1)
            expect(spyFind.mock.calls[0]).toEqual([{
                where: { userId: "userId" },
                take: 10,
                skip: 20,
                orderBy: { date: 'desc' }
            }])
        })
        
        it("when params are undefined should use defaults and get transactions correctly", async () => {
            const transaction = new Transaction("id", "userId", "date", "merchant", "note", 1, "ctgId", "account", "kind")
            const spyFind = jest.spyOn(prisma.transaction, "findMany").mockResolvedValue([transaction])
            const result = await transactionRepo.getAll("userId")
            expect(result).toEqual([transaction])
            expect(spyFind.mock.calls.length).toBe(1)
            expect(spyFind.mock.calls[0]).toEqual([{
                where: { userId: "userId" },
                take: DB_DEFAULT_LIMIT,
                skip: 0,
                orderBy: { date: 'desc' }
            }])
        })
    })

    describe("delete", () => {

        it("When a PrismaClientKnownRequestError with error code P2025 occurs, transform it to NotFound", async () => {
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2025", clientVersion: ""})
            jest.spyOn(prisma.transaction, "delete").mockRejectedValue(dbError)
            try {
                await transactionRepo.delete("id", "userId")
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof NotFound).toBe(true)
                if (error instanceof NotFound) {
                    expect(error.message).toBe("Transaction was not found")
                }
            }
        })

        it("when a different db error occurs should fail with that error", async () => {
            const dbError = new Error("different db error")
            jest.spyOn(prisma.transaction, "delete").mockRejectedValue(dbError)
            try {
                await transactionRepo.delete("id", "userId")
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof Error).toBe(true)
                if (error instanceof Error) {
                    expect(error.message).toBe("different db error")
                }
            }
        })

        it("should delete a transaction correctly", async () => {
            const spyDelete = jest.spyOn(prisma.transaction, "delete").mockResolvedValue(undefined)
            await transactionRepo.delete("id", "userId")
            expect(spyDelete.mock.calls.length).toBe(1)
            expect(spyDelete.mock.calls[0]).toEqual([{
                where: { id: "id", userId: "userId" }
            }])
        })
    })
})