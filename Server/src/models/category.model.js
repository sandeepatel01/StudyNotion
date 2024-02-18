import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        course: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
        description: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
)

export const Category = mongoose.model("Category", categorySchema);