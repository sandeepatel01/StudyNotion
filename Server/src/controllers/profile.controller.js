import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { Profile } from "../models/profile.model.js";


const updateProfile = asyncHandler(async (req, res) => {

    const { dateOfBirth = "", aboutUs = "", gender, contactNumber } = req.body;

    if (!(dateOfBirth || aboutUs || contactNumber || gender)) {
        throw new ApiError(400, "All fields are required")
    };


    const user = await User.findById(user?._id);
    const profileId = user.additionalDetails;
    const profileDetails = await Profile.findByIdAndUpdate(
        profileId,
        {
            $set: {
                dateOfBirth: dateOfBirth,
                aboutUs: aboutUs,
                corfirmPassword: contactNumber,
                gender: gender
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, profileDetails, "Account Details updated Successfully"))

});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    );

    const option = {
        httpOnly: true,
        secure: ture
    };

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(200, {}, "user logged out !!")
        );

});


export {
    updateProfile,
    logoutUser
};