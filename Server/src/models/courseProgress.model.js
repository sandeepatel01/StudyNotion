import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
    {
        courseID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        comlpetedLecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    },
    { timestamps: true }
)

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);