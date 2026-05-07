export default class Category {
    private readonly id: string
    private readonly name: string
    private readonly hue: number
    private readonly kind: string

    constructor(id: string, name: string, hue: number, kind: string) {
        this.id = id
        this.name = name
        this.hue = hue
        this.kind = kind
    }
}