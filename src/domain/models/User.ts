import bcrypt from "bcrypt"
import type { Register } from "../../dto/request/Register.ts"
import validateEmail from "../../lib/validateEmail.ts"
import ValidationError from "../errors/ValidationError.ts"

export default class User {

    readonly id: string
    readonly email: string
    readonly password: string    
    readonly name: string
    readonly roles: string[]

    constructor(id: string, email: string, password: string, roles: string[], name: string) {
        this.id = id
        this.email = email
        this.password = password
        this.name = name
        this.roles = roles
    }

    static fromRegister(dto: Register): User {
        const email = dto.email || ""
        if (!validateEmail(email)) {
            throw new ValidationError("Email must be a valid email")
        }
        if (typeof dto.password !== "string" || dto.password === "") {
            throw new ValidationError("Password must be a non-empy string")
        }
        const passwordHash = bcrypt.hashSync(dto.password, 10);
        return new User(
            crypto.randomUUID(),
            dto.email!, // we know its a valid email at this point
            passwordHash,
            ["user"],
            dto.name || ""
        )
    }
}