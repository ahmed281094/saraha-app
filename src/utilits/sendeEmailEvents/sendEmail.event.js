import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendMail.js";
import { generateToken } from "../token/generateToken.js";
export const eventEmitter = new EventEmitter()

eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;
    const token = await generateToken({
        payload: { email },
        SIGNATURE: process.env.SIGNATURE_CONFIRMATION,
        option: { expiresIn: 60 * 2 }
    })
    const link = `http://localhost:3000/users/confirmEmail/${token}`
    await sendEmail(email, "confirm email", `<a href="${link}">zew</a>`)
})