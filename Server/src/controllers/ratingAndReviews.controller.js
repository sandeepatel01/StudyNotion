import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

const createRating = asyncHandler(async (req, res) => {

    const { rating, review, courseId } = req.body;

    const userId = req.user?._id;

    const courseDetails = await Course.findOne(
        {
            _id: courseId,
            studentsEnrolled: {
                $elementMatch: {
                    $eq: userId
                }
            }
        }
    );
    if (!courseDetails) {
        throw new ApiError(404, "Student is not Enrolled in the course")
    };

    const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId
    });

    if (alreadyReviewed) {
        throw new ApiError(403, "Course is Already reviewd by the user")
    };

    const newRating = await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId
    });

    const createdNewRating = await RatingAndReview.findById(newRating._id);
    if (!createdNewRating) {
        throw new ApiError(500, "Something went wrong while creating the rating ")
    };

    const updateCourseDetails = await Course.findByIdAndUpdate(
        {
            _id: courseId
        },
        {
            $push: {
                ratingAndReview: newRating?._id
            }
        },
        { new: true }
    );

    console.log("Updated course details: ", updateCourseDetails);

    return res
        .status(201)
        .json(
            new ApiResponse(200, newRating, "Rating and reviews creaded Successfully")
        );

});

const getAverageRating = asyncHandler(async (req, res) => {

    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([
        {
            $match: {
                course: new mongoose.Schema.Types.ObjectId(courseId)
            }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" }
            }
        }
    ]);

    if (result.length > 0) {
        return res
            .status(200)
            .json({
                success: true,
                averageRating: result[0].averageRating
            })
    };

    return res
        .status(201)
        .json({
            success: true,
            averageRating: 0,
            message: "Average Rating is 0, no ratings given till now"
        });

});

const getAllRating = asyncHandler(async (req, res) => {

    const allReviews = await RatingAndReview.find({}).sort({ rating: "desc" })
        .populate({
            path: "user",
            select: "fullname, email, avatar"
        })
        .populate({
            path: "course",
            select: "name"
        })
        .exec();

    return res
        .status(200)
        .json(
            new ApiResponse(200, allReviews, "All reviews fetched successfully")
        );
});


export {
    createRating,
    getAverageRating,
    getAllRating
};