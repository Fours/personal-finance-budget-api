export default class ForeignConstraintFailed extends Error {

    constructor(message: string) {
        super(message);
        this.name = "ForeignConstraintFailed";
    }
}