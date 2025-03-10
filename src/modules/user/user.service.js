import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utilits/error/errorHandling.js";
import { eventEmitter } from "../../utilits/sendeEmailEvents/sendEmail.event.js";
import { Hash, compareHashing } from "../../utilits/hash/index.js";
import { Encrypt, Decrypt } from "../../utilits/encryption/index.js";
import { generateToken, verifyToken } from "../../utilits/token/index.js";
import messageModel from "../../DB/models/message.model.js";


export const signUp = asyncHandler(async (req, res, next) => {
    const { role, name, email, password, gender, phone } = req.body;
    const emailExsit = await userModel.findOne({ email })
    if (emailExsit) {
        return next(new Error("Email already exists", { cause: 400 }))
    }
    const hash = await Hash({ password, SALT_ROUNDS: process.env.SALT_ROUNDS })

    const phoneEncrypt = await Encrypt({ key: phone, SECERET_KEY: process.env.SECERET_KEY })

    eventEmitter.emit("sendEmail", { email })

    const user = await userModel.create({ role, name, email, password: hash, gender, phone: phoneEncrypt });
    return res.status(200).json({ msg: "done", user });
})



export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return next(new Error("token not found", { cause: 404 }))
    }
    const decoded = await verifyToken({ token, SIGNATURE: process.env.SIGNATURE_CONFIRMATION })
    if (!decoded?.email) {
        return next(new Error("invalid token payload", { cause: 400 }))
    }
    const user = await userModel.findOneAndUpdate(
        { email: decoded.email, confirmed: false },
        { confirmed: true }
    );

    if (!user) {
        return next(new Error("user not found or already confirmed", { cause: 404 }))
    }
    return res.status(200).json({ msg: "done" });
})


export const signIn = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user) {
        return next(new Error("email not exist or not confrimed yet", { cause: 404 }))
    }
    const isMatch = await compareHashing({ password, hashed: user.password })
    if (!isMatch) {
        return next(new Error("Invalid password", { cause: 401 }))
    }
    const token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE: user.role == "user" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN
    })
    return res.status(200).json({ msg: "done", token });

})


export const getProfile = asyncHandler(async (req, res, next) => {
    const phone = await Decrypt({ key: req.user.phone, SECERET_KEY: process.env.SECERET_KEY })
    const messages = await messageModel.find({ userId: req.user._id })
    const zew = req.user
    return res.status(200).json({ msg: "done", ...zew, phone,messages });
})

export const shareProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await userModel.findById(id).select("-_id name email")
    if (!user) {
        return next(new Error('User not found', { cause: 404 }));
    }
    return res.status(200).json({ msg: "done", user });
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    if (req.body.phone) {
        req.body.phone = await Encrypt({ key: req.body.phone, SECERET_KEY: process.env.SECERET_KEY })
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true })
    return res.status(201).json({ msg: "done", user });
})


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const checkPassword = await compareHashing({ password: oldPassword, hashed: req.user.password })
    if (!checkPassword) {
        return next(new Error('Invalid old password', { cause: 400 }))
    }
    const hash = await Hash({ password: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            password: hash,
            passwordChangedAt: Date.now()
        },
        { new: true })
    return res.status(201).json({ msg: "password updated successfully", user });
})


export const freezeAccount = asyncHandler(async (req, res, next) => {

    const user = await userModel.findByIdAndUpdate(req.user._id,
        {
            isDeleted: true,
            passwordChangedAt: Date.now()
        },
        { new: true })
    return res.status(201).json({ msg: "account deactivated", user });
})