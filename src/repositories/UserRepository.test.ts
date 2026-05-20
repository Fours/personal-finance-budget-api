import type { PrismaClient } from "@prisma/client/extension";
import User from "../domain/models/User";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import UserRepository from "./UserRepository";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed";
import { DB_DEFAULT_LIMIT } from "../lib/constants";

describe("UserRepository", () => {

    let prisma: PrismaClient
    let userRepo: UserRepository

    beforeEach(() => {
        prisma = {
            user: {
                create: () => { return Promise.reject(new Error("not implimented")) },
                findUnique: () => { return Promise.reject(new Error("not implimented")) },
                findMany: () => { return Promise.reject(new Error("not implimented")) }
            }
        }
        userRepo = new UserRepository(prisma)
    })

    describe("create", () => {

        it("When a PrismaClientKnownRequestError with error code P2002 occurs, transform it to UniqueConstraintFailed", async () => {
            const user = new User("id", "email", "password", [], "name")
            const dbError = new PrismaClientKnownRequestError("test", {code: "P2002", clientVersion: ""})
            jest.spyOn(prisma.user, "create").mockRejectedValue(dbError)
            try {
                await userRepo.create(user)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof UniqueConstraintFailed).toBe(true)
                if (error instanceof UniqueConstraintFailed) {
                    expect(error.message).toBe("test")
                }
            }
        })

        it("when a different db error occurs, should reject with that error", async () => {
            const user = new User("id", "email", "password", [], "name")
            const dbError = new Error("a different db error")
            jest.spyOn(prisma.user, "create").mockRejectedValue(dbError)
            try {
                await userRepo.create(user)
                throw new Error("test failed")
            } catch(error) {
                expect(error instanceof Error).toBe(true)
                if (error instanceof Error) {
                    expect(error.message).toBe("a different db error")
                }
            }
        })

        it("Should succeed and return the user", async () => {
            const user = new User("id", "email", "password", [], "name")            
            const createSpy = jest.spyOn(prisma.user, "create").mockResolvedValue(user)
            const result = await userRepo.create(user)
            expect(result).toEqual(user)
            expect(createSpy.mock.calls.length).toBe(1)
            expect(createSpy.mock.calls[0]).toEqual([{ data: user }])
        })
    })

    describe("getOne", () => {

        it("should succeed and return the user", async () => {
            const user = new User("id", "email", "password", [], "name")
            const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockResolvedValue(user)
            const result = await userRepo.getOne("id")
            expect(result).toEqual(user)
            expect(findUniqueSpy.mock.calls.length).toBe(1)
            expect(findUniqueSpy.mock.calls[0]).toEqual([{ where: { id: "id" } }])
        })        
    })

    describe("getOneByEmail", () => {

        it("should succeed and return the user", async () => {
            const user = new User("id", "email", "password", [], "name")
            const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockResolvedValue(user)
            const result = await userRepo.getOneByEmail("email")
            expect(result).toEqual(user)
            expect(findUniqueSpy.mock.calls.length).toBe(1)
            expect(findUniqueSpy.mock.calls[0]).toEqual([{ where: { email: "email" } }])
        })        
    })

    describe("getAll", () => {
        
        it("should succeed and return all users", async () => {
            const user = new User("id", "email", "password", [], "name")
            const findManySpy = jest.spyOn(prisma.user, "findMany").mockResolvedValue([user])
            const result = await userRepo.getAll(10, 20)
            expect(result).toEqual([user])
            expect(findManySpy.mock.calls.length).toBe(1)
            expect(findManySpy.mock.calls[0]).toEqual([{ take: 10, skip: 20, orderBy: { email: "asc" } }])
        })

        it("should use default values for limit and start when not provided", async () => {
            const user = new User("id", "email", "password", [], "name")
            const findManySpy = jest.spyOn(prisma.user, "findMany").mockResolvedValue([user])
            const result = await userRepo.getAll()
            expect(result).toEqual([user])
            expect(findManySpy.mock.calls.length).toBe(1)
            expect(findManySpy.mock.calls[0]).toEqual([{ take: DB_DEFAULT_LIMIT, skip: 0, orderBy: { email: "asc" } }])
        })
    })
})