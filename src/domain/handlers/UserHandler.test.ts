import bcrypt from "bcrypt"
import { Register } from "../../dto/request/Register"
import type IUserRepository from "../../repositories/IUserRepository"
import type IEventDispatcher from "../../services/IEventDispatcher"
import ValidationError from "../errors/ValidationError"
import NotFound from "../errors/NotFound"
import User from "../models/User"
import UserHandler from "./UserHandler"
import type { Login } from "../../dto/request/Login"
import Unauthorized from "../errors/Unauthorized"

describe("UserHandler", () => {

    class FakeUserRepository implements IUserRepository {
        create(user: User): Promise<User> {
            throw new Error("not implimented")
        }
        getOne(userId: string): Promise<User | null> {
            throw new Error("not implimented")
        }
        getOneByEmail(email: string): Promise<User | null> {
            throw new Error("not implimented")
        }
        getAll(limit?: number, start?: number): Promise<User[]> {
            throw new Error("not implimented")
        }        
    }

    class FakeEventDispatcher implements IEventDispatcher {
        emit(eventName: string, payload: Record<string, any>): void {
            throw new Error("not implemented.")
        }        
    }
    
    let userRepo: FakeUserRepository
    let eventDispatcher: FakeEventDispatcher
    let userHandler: UserHandler
    
    beforeEach(() => {
        userRepo = new FakeUserRepository()
        eventDispatcher = new FakeEventDispatcher()
        userHandler = new UserHandler(userRepo, eventDispatcher)
    })
    
    describe("register", () => {

        it("when email is undefined should fail with a ValidationError", async () => {
            const register = { password: "password", name: "name" }
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email must be a valid email address")
                }                
            }
        })

        it("when email is not a string should fail with a ValidationError", async () => {
            const register = { email: 1, password: "password", name: "name" } as unknown as Register
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email must be a valid email address")
                }                
            }
        })

        it("when email is invalid should fail with a ValidationError", async () => {
            const register = { email: "invalid.email", password: "password", name: "name" }
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email must be a valid email address")
                }
            }
        })

        it("when password is undefined should fail with a ValidationError", async () => {
            const register = { email: "email@email.com", name: "name" }
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Password must be a non-empy string")
                }                
            }
        })

        it("when password is not a string should fail with a ValidationError", async () => {
            const register = { email: "email@email.com", password: 1, name: "name" } as unknown as Register
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Password must be a non-empy string")
                }                
            }
        })

        it("when password is an empty string should fail with a ValidationError", async () => {
            const register = { email: "email@email.com", password: "", name: "name" }
            try {
                await userHandler.register(register)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Password must be a non-empy string")
                }                
            }
        })

        it("should save a new user with correct properties", async () => {
            const register = { email: "email@email.com", password: "password", name: "name" }
            const uuid = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
            const spyCreate = jest.spyOn(userRepo, "create").mockResolvedValue(new User("", "", "", [], "")) // return value is unused
            const spyEmit = jest.spyOn(eventDispatcher, "emit").mockReturnValue()
            const spyHash = jest.spyOn(bcrypt, "hashSync").mockReturnValue("password-hash")
            const spyUuid = jest.spyOn(crypto, "randomUUID").mockReturnValue(uuid)
            const user = await userHandler.register(register)
            expect(user).toEqual({
                id: uuid,
                email: register.email,
                name: register.name,
                roles: ["user"]
            })
            expect(spyCreate.mock.calls.length).toBe(1)
            expect(spyCreate.mock.calls[0]).toEqual([{
                id: "5d6863bd-beec-4e07-bf4f-a39098d1da97",
                email: "email@email.com",                
                name: "name", 
                password: "password-hash", 
                roles: ["user"]
            }])
            expect(spyEmit.mock.calls.length).toBe(1)
            expect(spyEmit.mock.calls[0]).toEqual([
                "UserRegistered",
                {
                    id: "5d6863bd-beec-4e07-bf4f-a39098d1da97",
                    email: "email@email.com",
                    name: "name"
                }
            ])
            expect(spyHash.mock.calls.length).toBe(1)
            expect(spyHash.mock.calls[0]).toEqual([ register.password, 10 ])
        })
    })

    describe("login", () => {

        it("when email is not a string should fail with a ValidationError", async () => {
            const dto = { email: 1, password: "password"} as unknown as Login
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email and password must be non-empty strings")
                }
            }
        })

        it("when email is an empty string should fail with a ValidationError", async () => {
            const dto = { email: "", password: "password"} as unknown as Login
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email and password must be non-empty strings")
                }
            }
        })

        it("when password is not a string should fail with a ValidationError", async () => {
            const dto = { email: "email", password: 1} as unknown as Login
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email and password must be non-empty strings")
                }
            }
        })

        it("when password is an empty string should fail with a ValidationError", async () => {
            const dto = { email: "email", password: ""} as unknown as Login
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof ValidationError).toBe(true)
                if (error instanceof ValidationError) {
                    expect(error.message).toBe("Email and password must be non-empty strings")
                }
            }
        })
        
        it("when user is not found should fail with a NotFound error", async () => {
            const dto = { email: "email", password: "password" } 
            const spyGet = jest.spyOn(userRepo, "getOneByEmail").mockResolvedValue(null)
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof NotFound).toBe(true)
                if (error instanceof NotFound) {
                    expect(error.message).toBe("Could not find user with that email")
                }
            }
        })

        it("when passowrd is not a match should fail with Unauthorized error", async () => {
            const dto = { email: "email", password: "password" } 
            const spyGet = jest.spyOn(userRepo, "getOneByEmail").mockResolvedValue(new User("id", "email", "encrypted-password", [], ""))
            const spyCompare = jest.spyOn(bcrypt, "compareSync").mockReturnValue(false)
            try {
                await userHandler.login(dto)
            } catch(error) {
                expect(error instanceof Unauthorized).toBe(true)
                if (error instanceof Unauthorized) {
                    expect(error.message).toBe("Incorrect password")
                }                
            }
            expect(spyCompare.mock.calls.length).toBe(1)
            expect(spyCompare.mock.calls[0]).toEqual(["password", "encrypted-password"])
        })

        it("when passowrd is a match should succeed", async () => {
            const dto = { email: "email", password: "password" } 
            const spyGet = jest.spyOn(userRepo, "getOneByEmail").mockResolvedValue(new User("id", "email", "encrypted-password", [], ""))
            const spyCompare = jest.spyOn(bcrypt, "compareSync").mockReturnValue(true)
            const userWithoutPassword = await userHandler.login(dto)
            expect(userWithoutPassword).toEqual({
                id: "id",
                email: "email",
                name: "",
                roles: []
            })            
        })

    })
})