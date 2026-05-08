import { CreateTransaction } from "../../dto/request/CreateTransaction";
import type Transaction from "../models/Transaction";

export default interface ITransactionHandler {

    create(userId: string, dto: CreateTransaction): Promise<Transaction>
    
    getAll(userId: string, limit?: number, start?: number): Promise<Transaction[]>
}