import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        description: {
            type: String,
            required: true,
            trime: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        whatYouWillLearn: {
            type: String,
            required: true,
            trime: true
        },
        content: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        },
        ratingAndReview: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview"
            }
        ],
        price: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    },
    { timestamps: true }
)

export const Course = mongoose.model("Course", courseSchema);