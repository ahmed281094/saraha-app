
import joi from 'joi';
import { generalRules } from '../../utilits/generalRules/index.js';
import { enumGender } from '../../DB/models/user.model.js';



export const signUpSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(2).max(10).required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        rPassword: joi.string().valid(joi.ref('password')).required(),
        gender: joi.string().valid(enumGender.male, enumGender.female).required(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        id: generalRules.objectId
    }).required()
}

export const signInSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).required()
}


export const updateProfileSchema = {
    body: joi.object({
        name: joi.string().alphanum().min(2).max(10),
        gender: joi.string().valid(enumGender.male, enumGender.female),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/)
    }).required(),
    headers: generalRules.headers.required()
}


export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required()
    }).required(),
    headers: generalRules.headers.required()
}

export const freezeAcoountSchema = {
    headers: generalRules.headers.required()
    }

    export const shareProfileSchema = {
        params: joi.object({
          id:  generalRules.objectId.required()
        })
        }