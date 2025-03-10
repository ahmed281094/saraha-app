import { asyncHandler } from "../utilits/error/errorHandling.js"
export const validation = (schema) => {
    return asyncHandler(async (req, res, next) => {
        const validationRuslt = []
        for (const key of Object.keys(schema)) {
            const validationError = schema[key].validate(req[key], { abortEarly: false })
            if (validationError?.error) {
                validationRuslt.push(validationError.error.details)   
            }
        }
        if (validationRuslt.length > 0) {
            return res.status(400).json({ msg: "validation error", errors: validationRuslt })
        }
        next();
    })
}





