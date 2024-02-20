import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

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