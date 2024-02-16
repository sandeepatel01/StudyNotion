import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        usernmane: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        accountType: {
            type: String,
            required: true,
            enum: ["Admin", "Student", "Instructor"]
        },
        additionalDetails: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile"
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
        avatar: {
            type: String,
            required: true
        },
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

export const User = mongoose.model("User", userSchema);