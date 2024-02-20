import { User } from "../models/user.model.js";
import { Section } from "../models/section.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Course } from "../models/course.model.js";


// ****************** Create Section Handler ************** 
const createSection = asyncHandler(async (req, res) => {

    const { sectionName, courseId } = req.body;

    if (!(sectionName || courseId)) {
        throw new ApiError(400, "All fields are required")
    };

    const newSection = await Section.create({ sectionName });

    const createdNewSection = await Section.findById(newSection._id);
    if (!createdNewSection) {
        throw new ApiError(400, "Something went wrong while creating new section")
    };

    const updateCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
            $push: {
                content: newSection?._id
            }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateCourseDetails,
                "Section created successfully"
            )
        )

});

// ************ Update Section Handler **************** 
const updateSection = asyncHandler(async (req, res) => {

    const { sectionName, sectionId } = req.body;

    if (!(sectionName || sectionId)) {
        throw new ApiError(400, "All fields are Required")
    };

    const updateSection = await Section.findByIdAndUpdate(
        sectionId,
        {
            sectionName
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updateSection, "Section updated successfully")
        )

});

// ************ delete Section Handler **************** 
const deleteSection = asyncHandler(async (req, res) => {

    const { sectionId } = req.params;

    await Section.findByIdAndDelete(sectionId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Section deleted successfully")
        );

});

export {
    createSection,
    updateSection,
    deleteSection
};