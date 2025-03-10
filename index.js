import express from "express"
import bootstrap from "./src/app.controller.js"
import path from "path"
import dotenv from "dotenv"
dotenv.config({path:path.resolve("config/.env")})

const app = express()
const port = process.env.PORT

bootstrap(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))














