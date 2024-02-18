import { Category } from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {

    const { name, description } = req.body;
    if (!(name || description)) {
        throw new ApiError(400, "All fields are requirsed")
    };

    const category = await Category.create({
        name: name,
        description: description
    });
    // console.log("category: ", category);
    if (!category) {
        throw new ApiError(500, "Something went wrong while creating category")
    };

    return res
        .status(200)
        .json(
            new ApiResponse(200, createdUser, "Category created Successfully")
        );

});

const getAllCategory = asyncHandler(async (req, res) => {

    const allCategory = await Category.find({}, {
        name: true, description: true
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                allCategory,
                "All Category return successfully"
            )
        );

});

export {
    createCategory,
    getAllCategory
};