import httpMocks from "node-mocks-http"
import { Request } from "express"
import UserController from "./UserController"
import type IUserHandler from "../domain/handlers/IUserHandler"
import type { Register } from "../dto/request/Register"
import type { Login } from "../dto/request/Login"
import { User } from "../dto/response/User"

describe("UserController", () => {

    let userHandler: IUserHandler
    let userController: UserController

    beforeEach(() => {
        userHandler = {
            register: (dto: Register) => { throw new Error("not implimented") },
            login: (dto: Login) => { throw new Error("not implimented") },
            getAll: (limit?: number, start?: number) => { throw new Error("not implimented") },
            getOne: (userId: string) => { throw new Error("not implimented") }
        }
        userController = new UserController(userHandler)
    })

    describe("getAll", () => {

        it("when limit is provided but not a number should return 400", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            req.query.limit = "true"
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toEqual({ message: "Optional query params 'limit' and 'start' must be numbers if provided" })
        })

        it("when start is provided but not a number should return 400", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            req.query.start = "true"
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toEqual({ message: "Optional query params 'limit' and 'start' must be numbers if provided" })
        })

        it("when user does not have the 'amdin' role should return 403", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(403)
            expect(res._getJSONData()).toEqual({ message: "Admin permission required" })
        })

        it("should successfully return users", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            res.locals.user = { roles: ["admin"] }
            const user: User = { id: "id", email: "email", roles: [], name: ""}
            const getAllSpy = jest.spyOn(userHandler, "getAll").mockResolvedValue([user])
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toEqual([user])
            expect(getAllSpy.mock.calls.length).toBe(1)
            expect(getAllSpy.mock.calls[0]).toEqual([])
        })

        it("should use limit and start params when provided", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            res.locals.user = { roles: ["admin"] }
            req.query.limit = "10"
            req.query.start = "20"
            const user: User = { id: "id", email: "email", roles: [], name: ""}
            const getAllSpy = jest.spyOn(userHandler, "getAll").mockResolvedValue([user])
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toEqual([user])
            expect(getAllSpy.mock.calls.length).toBe(1)
            expect(getAllSpy.mock.calls[0]).toEqual([10, 20])
        })

        it("should should handle error when userHanlder returns rejection", async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            res.locals.user = { roles: ["admin"] }
            const getAllSpy = jest.spyOn(userHandler, "getAll").mockRejectedValue(new Error("test"))            
            await userController.getAll(req, res)
            expect(res.statusCode).toBe(500)
            expect(res._getJSONData()).toEqual({ message: "Internal server error" })
        })
    })

    describe("getOne", () => {

        it("when userId is not a valid uuid should return 400", async () => {
            const req: Request<{ id: string }> = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            req.params.id = "not-a-uuid"
            await userController.getOne(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toEqual({ message: "User id must be a valid UUID" })
        })

        it("when user does not have the 'admin' role should return 403", async () => {
            const req: Request<{ id: string }> = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            req.params.id = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
            await userController.getOne(req, res)
            expect(res.statusCode).toBe(403)
            expect(res._getJSONData()).toEqual({ message: "Admin permission required" })
        })

        it("should succeed and return the user", async () => {
            const req: Request<{ id: string }> = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const user = { id: "5d6863bd-beec-4e07-bf4f-a39098d1da97", email: "email", roles: [], name: "name" }
            req.params.id = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
            res.locals.user = { id: "1e573b8b-f9a1-4d53-8f43-577301561d1c", roles: [ "admin" ] }
            const getOneSpy = jest.spyOn(userHandler, "getOne").mockResolvedValue(user)
            await userController.getOne(req, res)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toEqual(user)
        })

        it("should handle an error when userHandler return rejection", async () => {
            const req: Request<{ id: string }> = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            req.params.id = "5d6863bd-beec-4e07-bf4f-a39098d1da97"
            res.locals.user = { id: "1e573b8b-f9a1-4d53-8f43-577301561d1c", roles: [ "admin" ] }
            const getOneSpy = jest.spyOn(userHandler, "getOne").mockRejectedValue(new Error("test"))
            await userController.getOne(req, res)
            expect(res.statusCode).toBe(500)
            expect(res._getJSONData()).toEqual({ message: "Internal server error"})
        })
    })
})