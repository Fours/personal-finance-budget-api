import httpMocks from "node-mocks-http"
import errorResponses from "./errorResponses";
import ValidationError from "../domain/errors/ValidationError";
import NotFound from "../domain/errors/NotFound";
import Unauthorized from "../domain/errors/Unauthorized";
import ForeignConstraintFailed from "../domain/errors/ForeignConstraintFailed";
import UniqueConstraintFailed from "../domain/errors/UniqueConstraintFailed";

describe("errorResponses", () => {

    it("when error is ValidationError should return 400", () => {
        const res = httpMocks.createResponse();
        const error = new ValidationError("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: "ValidationError: test" })
    })

    it("when error is NotFound should return 404", () => {
        const res = httpMocks.createResponse();
        const error = new NotFound("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toEqual({ message: "test" })
    })

    it("when error is Unauthorized should return 401", () => {
        const res = httpMocks.createResponse();
        const error = new Unauthorized("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData()).toEqual({ message: "Unauthorized: test" })
    })

    it("when error is ForeignConstraintFailed should return 400", () => {
        const res = httpMocks.createResponse();
        const error = new ForeignConstraintFailed("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: "ForeignConstraintFailed: test" })
    })

    it("when error is UniqueConstraintFailed should return 400", () => {
        const res = httpMocks.createResponse();
        const error = new UniqueConstraintFailed("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toEqual({ message: "UniqueConstraintFailed: test" })
    })

    it("when error is any other error should return 500", () => {
        const res = httpMocks.createResponse();
        const error = new Error("test")
        errorResponses(res, error)
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData()).toEqual({ message: "Internal server error" })
    })
})