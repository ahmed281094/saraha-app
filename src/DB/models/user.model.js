import mongoose from "mongoose"
import { roles } from "../../middleware/auth.js"

export const enumGender = {
    male: "male",
    female: "female"
}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 2,
        maxLength: 10,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    phone: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6,

    },
    gender: {
        type: String,
        enum: Object.values(enumGender),
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.user
    },
    passwordChangedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel