import type { Login } from "../../dto/request/Login";
import type { Register } from "../../dto/request/Register";
import type { User } from "../../dto/response/User";

export default interface IUserHandler {

    register(dto: Register): Promise<User>

    login(dto: Login): Promise<User>

    getAll(limit: number, start: number): Promise<User[]>

    getOne(userId: string): Promise<User>

}