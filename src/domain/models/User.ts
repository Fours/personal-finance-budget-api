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
}