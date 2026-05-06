import User from "../domain/models/User"

export default interface IUserRepository {

    create: (user: User) => Promise<User>

    getOne: (userId: string) => Promise<User>

    getAll: (limit: number, start: number) => Promise<User[]>
}