import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Beare");

        if (!token) {
            throw new ApiError(401, "UnAuthorized request")
        };

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // console.log("Decoded token: ", decodedToken);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )

        if (!user) {
            throw new ApiError(401, "Invalid AccessToken")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(
            401,
            error.message,
            "Invalid Access token"
        )
    }
});

const isAdmin = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(user._id)
        if (user.accountType !== "Admin") {
            throw new ApiError(400, "This is a PROTECTED route for Admin only")
        };

        return res
            .status(200)
            .json(
                new ApiResponse(200, user?.accountType, "Admin Route")
            );

    } catch (error) {
        throw new ApiError(
            500,
            "User role con not be verified, Please try again!"
        )
    };
});

const isInstructor = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(user._id)
        if (user.accountType !== "Instructor") {
            throw new ApiError(400, "This is a PROTECTED route for Instructor only")
        };

        return res
            .status(200)
            .json(
                new ApiResponse(200, user?.accountType, "Instructor Route")
            );

    } catch (error) {
        throw new ApiError(
            500,
            "User role con not be verified, Please try again!!"
        )
    };
});

const isStudent = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(user._id)
        if (user.accountType !== "Student") {
            throw new ApiError(400, "This is a PROTECTED route for Student only")
        };

        return res
            .status(200)
            .json(
                new ApiResponse(200, user?.accountType, "Student Route")
            );

    } catch (error) {
        throw new ApiError(
            500,
            "User role con not be verified, Please try again!!!"
        )
    };
});

export {
    verifyJWT,
    isAdmin,
    isInstructor,
    isStudent
};