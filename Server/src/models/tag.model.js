import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        description: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
)

export const Tag = mongoose.model("Tag", tagSchema);