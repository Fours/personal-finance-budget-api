import bcrypt from "bcrypt"
import User from "../models/User.ts";
import type { Register } from "../../dto/request/Register.ts";
import type IUserRepository from "../../repositories/IUserRepository";
import type IUserHandler from "./IUserHandler";
import NotFound from "../errors/NotFound.ts";
import Unauthorized from "../errors/Unauthorized.ts";
import type { Login } from "../../dto/request/Login.ts";
import ValidationError from "../errors/ValidationError.ts";
import type { User as UserWithoutPassword } from "../../dto/response/User.ts"
import validateEmail from "../../lib/validateEmail.ts"
import type IEventDispatcher from "../../services/IEventDispatcher.ts";

export default class UserHandler implements IUserHandler {

    private readonly userRepo: IUserRepository
    private readonly eventDispatcher: IEventDispatcher

    constructor(userRepo: IUserRepository, eventDispatcher: IEventDispatcher) {
        this.userRepo = userRepo
        this.eventDispatcher = eventDispatcher
    }
    
    async register(dto: Register): Promise<UserWithoutPassword> {
        const email = dto.email || ""        
        if (!validateEmail(email)) {
            throw new ValidationError("Email must be a valid email address")
        }
        if (typeof dto.password !== "string" || dto.password === "") {
            throw new ValidationError("Password must be a non-empy string")
        }
        const passwordHash = bcrypt.hashSync(dto.password, 10);
        const user = new User(
            crypto.randomUUID(),
            dto.email!, // we know its a non-empty valid email at this point
            passwordHash,
            ["user"], // default starting role
            dto.name || ""
        )
        await this.userRepo.create(user)
        this.eventDispatcher.emit("UserRegistered", {
            id: user.id,
            email: user.email,
            name: user.name
        })
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles
        }
    }

    async login(dto: Login): Promise<UserWithoutPassword> {
        if (!dto.email || !dto.password) {
            throw new ValidationError("Email and password must be non-empty strings")
        }
        const user = await this.userRepo.getOneByEmail(dto.email)
        if (!user) {
            throw new NotFound("Could not find user with that email")
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (isMatch) {
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles
            }
        } else {
            throw new Unauthorized("Incorrect password")
        }
    }

    async getAll(limit?: number, start?: number): Promise<UserWithoutPassword[]> {        
        const users = await this.userRepo.getAll(limit, start)
        return users.map(user => {
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles
            }
        })
    }

    async getOne(userId: string): Promise<UserWithoutPassword> {
        const user = await this.userRepo.getOne(userId)
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles
        }
    }
}