import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        duration: {
            type: String
        },
        lectureUrl: {
            type: String
        }

    },
    { timestamps: true }
)

export const SubSection = mongoose.model("SubSection", subSectionSchema);