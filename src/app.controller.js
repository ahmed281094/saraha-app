import connectionDB from "./DB/DBconnection.js"
import messageRouter from "./modules/message/message.controller.js"
import userRouter from "./modules/user/user.controller.js"
import { globalErrorHandling } from "./utilits/error/errorHandling.js"

const bootstrap = (app, express) => {
    app.use(express.json())
    app.use("/users", userRouter)
    app.use("/messages", messageRouter)
    
    connectionDB()
    app.use("*", (req, res, next) => {
        return next(new Error(`no url found ${req.originalUrl}`))
    })
    app.use(globalErrorHandling)
}

export default bootstrap