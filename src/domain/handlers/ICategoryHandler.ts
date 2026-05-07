import type Category from "../models/Category";

export default interface ICategoryHandler {

    getAll(): Promise<Category[]>
}