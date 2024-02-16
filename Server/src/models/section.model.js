import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        subSection: [{
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }]
    },
    { timestamps: true }
)

export const Section = mongoose.model("Section", sectionSchema);