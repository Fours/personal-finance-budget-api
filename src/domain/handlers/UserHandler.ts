import User from "../models/User.ts";
import type { Register } from "../../dto/Register";
import type IUserRepository from "../../repositories/IUserRepository";
import type IUserHandler from "./IUserHandler";

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



}