import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadImagesOnCloudinary } from "../utils/fileUpload.js"


// *************** User Register controller *************
const registerUser = asyncHandler(async (req, res) => {

    const {
        fullname,
        username,
        email,
        password,
        confirmPassword,
        accountType,
        otp

    } = req.body;

    // console.log("fullname: ", fullname);
    // console.log("email: ", email)

    if (
        [fullname, username, email, password, confirmPassword, accountType, otp].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    };


    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and confirmPassword value does not match, Please try again!")
    }


    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists")
    };


    const avatarLocalPath = await req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required")
    };

    const avatar = await uploadImagesOnCloudinary(avatarLocalPath);
    if (avatar) {
        throw new ApiError(400, "Avatar file is required!!")
    };


    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        confirmPassword,
        accountType,
        avatar: avatar.url

    });

    const createdUser = await User.findById(user._id).select(
        "-password confirmPassword refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User Registerd Successfully")
        )


});

export { registerUser };