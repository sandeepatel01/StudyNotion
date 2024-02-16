import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        gender: {
            type: String
        },
        dateOfBirth: {
            type: String
        },
        contactNumber: {
            type: Number,
            trim: true
        },
        aboutUs: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
)

export const Profile = mongoose.model("Profile", profileSchema);