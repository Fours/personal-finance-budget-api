import type Category from "../domain/models/Category";

export default interface ICategoryRepository {

    getAll(): Promise<Category[]>

}