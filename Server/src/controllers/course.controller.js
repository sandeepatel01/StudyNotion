import { Course } from "../models/course.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model";
import { User } from "../models/user.model.js";
import { uploadImagesOnCloudinary } from "../utils/fileUpload";


const createCourse = asyncHandler(async (req, res) => {

    const { name, description, price, category, whatYouWillLearn } = req.body;

    if (
        [name, description, price, category, whatYouWillLearn].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    };

    const thumbnailImage = req.file.thumbnail;
    if (!thumbnailImage) {
        throw new ApiError(400, "All fields are required")
    };

    const user = await User.findById(user?._id);
    // console.log("user: ", user);
    if (!user) {
        throw new ApiError(404, "User Details not found")
    };

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
        throw new ApiError(404, "Category Details not found")
    };

    const thumbnail = await uploadImagesOnCloudinary(thumbnailImage,
        process.env.FOLDER_NAME);

    if (!thumbnail) {
        throw new ApiError(400, "thumbnail image not uploaded on cloudinary")
    }

    const newCourse = await Course.create({
        name,
        description,
        instructor: user?._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        category: categoryDetails?._id,
        thumbnail: thumbnail.url
    });

    await User.findByIdAndUpdate(
        { _id: user._id },
        {
            $push: {
                course: newCourse._id
            }
        },
        { new: true }
    );

    // TODO: Update category Schema 

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newCourse,
                "Course created successfully"
            )
        );

});


const getAllCourses = asyncHandler(async (req, res) => {

    const allCourses = await Course.find({}, {
        name: true,
        price: true,
        thumbnail: true,
        instructor: true,
        studentsEnrolled: true,
        ratingAndReview: true,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allCourses,
                "Get All Courses Successfully"
            )
        )

})

export {
    createCourse,
    getAllCourses
};