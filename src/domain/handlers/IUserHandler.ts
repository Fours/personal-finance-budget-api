import type { Login } from "../../dto/Login";
import type { Register } from "../../dto/Register";
import type User from "../models/User";

export default interface IUserHandler {

    register: (dto: Register) => Promise<User>

    login: (dto: Login) => Promise<User>

}