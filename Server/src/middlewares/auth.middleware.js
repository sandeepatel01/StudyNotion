import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Beare");

        if (!token) {
            throw new ApiError(401, "UnAuthorized request")
        };

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("Decoded token: ", decodedToken);

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
})

export { verifyJWT };