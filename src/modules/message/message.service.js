
import { populate } from "dotenv";
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utilits/error/errorHandling.js";

export const sendeMessage = asyncHandler(async (req, res, next) => {
    const { userId, content } = req.body
    const userExist = await userModel.findOne({ _id: userId, isDeleted: false })
    if (!userExist) {
        return next(new Error("User not found", { cause: 404 }));
    }
    const message = await messageModel.create({ userId, content })
    return res.status(200).json({ msg: "done", message })
})

export const getMessages = asyncHandler(async (req, res, next) => {

    const messages = await messageModel.find({ userId: req.user._id }).populate([{
        path: 'userId',
        select: 'name email -_id'
    }])
    return res.status(200).json({ msg: "done", messages })
})