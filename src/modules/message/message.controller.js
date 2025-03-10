import { Router } from "express";
import { getMessages, sendeMessage } from "./message.service.js";
import { sendMessageSchema } from "./message.validation.js";
import { validation } from "../../middleware/validation.js";
import { authentcation } from "../../middleware/auth.js";

const messageRouter = Router()
messageRouter.post("/sendMessage",validation(sendMessageSchema),sendeMessage)
messageRouter.get("/getMessages",authentcation,getMessages)

export default messageRouter