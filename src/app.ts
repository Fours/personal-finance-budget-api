import express from "express"
import type { Express, Request, Response } from "express"
import cors from "cors"

type Message = {
    message: string
}

const app: Express = express()

app.use(cors())

app.use((req: Request, res: Response<Message>): void => {
    res.status(404).json({message: "No endpoint found"})
})

export default app