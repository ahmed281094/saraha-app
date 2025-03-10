
import jwt from 'jsonwebtoken';
import userModel from '../DB/models/user.model.js';
import { asyncHandler } from '../utilits/error/errorHandling.js';

export const roles = {
    user: "user",
    admin: "admin"
}

export const authentcation = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers
    const [prefix, token] = authorization.split(" ") || []
    if (!token || !prefix) {
        return next(new Error("token is required", { cause: 401 }))
    }
    let SGNATURE_TOKEN = undefined
    if (prefix == "admin") {
        SGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_ADMIN
    } else if (prefix == "bearer") {
        SGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_USER
    }
    else {
        return next(new Error("invalid token prefix", { cause: 401 }))
    }
    const decoded = jwt.verify(token, SGNATURE_TOKEN)
    if (!decoded?.id) {
        return next(new Error("invalid token payload", { cause: 401 }))
    }
    const user = await userModel.findById(decoded.id).lean()
    if (!user) {
        return next(new Error("user not found", { cause: 404 }))
    }
    if (user?.isDeleted) {
        return next(new Error("user is deleted", { cause: 401 }))
    }
    if (user.passwordChangedAt && parseInt(user.passwordChangedAt.getTime() / 1000) > decoded.iat) {
        return next(new Error("token expired", { cause: 401 }));
    }
    req.user = user
    next()
})
export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("access denied", { cause: 403 }))
        }
        next()
    })
}