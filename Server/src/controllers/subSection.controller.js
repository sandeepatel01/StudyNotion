import { SubSection } from "../models/subSection.model.js";
import { Section } from "../models/section.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImagesOnCloudinary } from "../utils/fileUpload";
import { ApiError } from "../utils/ApiError.js";


const createSubSection = asyncHandler(async (req, res) => {

    const { title, description, duration, sectionId } = req.body;

    if (
        [title, description, duration, sectionId].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    };

    const lectureLocalPath = req.files?.lecture[0]?.path;
    if (!lectureLocalPath) {
        throw new ApiError(400, "Lecture File is required")
    };

    const lecture = await uploadImagesOnCloudinary(lectureLocalPath);
    if (!lecture) {
        throw new ApiError(400, "lecture file not uploaded on cloudinary")
    };

    const newSubSection = await SubSection.create({
        title: title,
        description: description,
        duration: `${lecture.duration}`,
        lecture: lecture?.url
    });

    const createdNewSubSection = await SubSection.findById(newSubSection?._id);
    if (!createdNewSubSection) {
        throw new ApiError(400, "Something went wrong while creating sub section")
    };

    const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        {
            $push: {
                subSection: newSubSection?._id
            }
        },
        { new: true }
    );

    return res
        .status(201)
        .json(
            new ApiResponse(200, updatedSection, "Sub section created Successfully")
        );

});

const updateSubSection = asyncHandler(async (req, res) => {

    const { title, subSectionId } = req.body;

    const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedSubSection, "Sub Section updated successfully")
        )

});

const deleteSubSection = asyncHandler(async (req, res) => {

    const { subSectionId } = req.params;

    await SubSection.findByIdAndDelete(subSectionId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Section deleted successfully")
        );


});

export {
    createSubSection,
    updateSubSection,
    deleteSubSection
}