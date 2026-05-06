import "dotenv/config"
import app from "./app.ts"

const PORT = process.env.PORT || 8000
if(!process.env.JWT_SECRET) {
    throw new Error("Must provide JWT_SECRET env variable")
}

const server = app.listen(PORT, (): void => {
    console.log(`Listening on port: ${PORT}`)
})

// module.exports = server; // for tests