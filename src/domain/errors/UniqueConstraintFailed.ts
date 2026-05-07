export default class UniqueConstraintFailed extends Error {

    constructor(message: string) {
        super(message);
        this.name = "UniqueConstraintFailed";
    }
}