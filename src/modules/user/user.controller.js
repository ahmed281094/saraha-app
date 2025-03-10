import { Router } from "express"
import { confirmEmail, freezeAccount, getProfile, shareProfile, signIn, signUp, updatePassword, updateProfile } from "./user.service.js"
import { authentcation, authorization, roles } from "../../middleware/auth.js"
import { validation } from "../../middleware/validation.js"
import { freezeAcoountSchema, shareProfileSchema, signInSchema, signUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js"

const userRouter = Router()

userRouter.post("/signUp", validation(signUpSchema), signUp)
userRouter.post("/signIn", validation(signInSchema), signIn)
userRouter.get("/confirmEmail/:token", confirmEmail)
userRouter.get("/profile",
    authentcation,
    authorization(roles.user),
    getProfile
)
userRouter.get("/shareProfile/:id",
    validation(shareProfileSchema),
    shareProfile
)
userRouter.patch("/updateProfile",
    validation(updateProfileSchema),
    authentcation,
    updateProfile
)
userRouter.patch("/updatePassword",
    validation(updatePasswordSchema),
    authentcation,
    updatePassword
)
userRouter.delete("/freezeAccount",
    validation(freezeAcoountSchema),
    authentcation,
    freezeAccount
)
export default userRouter