import { CreateTransaction } from "../../dto/request/CreateTransaction";
import { UpdateTransaction } from "../../dto/request/UpdateTransaction";
import type Transaction from "../models/Transaction";

export default interface ITransactionHandler {

    create(userId: string, dto: CreateTransaction): Promise<Transaction>

    update(id: string, userId: string, dto: UpdateTransaction): Promise<Transaction>
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>

    delete(id: string, userId: string): Promise<void>
}