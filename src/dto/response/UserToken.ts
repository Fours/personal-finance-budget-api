import type { User } from "./User.ts"

export type UserToken = {
    user: User,
    token: string
}