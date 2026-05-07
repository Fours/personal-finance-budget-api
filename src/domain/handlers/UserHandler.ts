import bcrypt from "bcrypt"
import User from "../models/User.ts";
import type { Register } from "../../dto/Register";
import type IUserRepository from "../../repositories/IUserRepository";
import type IUserHandler from "./IUserHandler";
import NotFound from "../errors/NotFound.ts";
import Unauthorized from "../errors/Unauthorized.ts";
import type { Login } from "../../dto/Login.ts";
import ValidationError from "../errors/ValidationError.ts";

export default class UserHandler implements IUserHandler {

    private readonly userRepo: IUserRepository

    constructor(userRepo: IUserRepository) {
        this.userRepo = userRepo
    }
    
    async register(dto: Register): Promise<User> {
        const user = User.fromRegister(dto)
        await this.userRepo.create(user)
        return user
    }

    async login(dto: Login): Promise<User> {
        if (!dto.email || !dto.password) {
            throw new ValidationError("Email and password must be non-empty strings")
        }
        const user = await this.userRepo.getOneByEmail(dto.email)
        if (!user) {
            throw new NotFound("Could not find user with that email")
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (isMatch) {
            return user
        } else {
            throw new Unauthorized("Incorrect password")
        }
    }

    async getAll(limit: number, start: number): Promise<User[]> {        
        return this.userRepo.getAll(limit, start)
    }

    async getOne(userId: string): Promise<User> {
        return this.userRepo.getOne(userId)
    }

}