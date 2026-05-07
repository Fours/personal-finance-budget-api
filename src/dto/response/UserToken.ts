export type UserToken = {
    user: {
        id: string
        email: string
        name: string
        roles: string[]
    },
    token: string
}