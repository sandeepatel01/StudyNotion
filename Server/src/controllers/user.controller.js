import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import { uploadImagesOnCloudinary } from "../utils/fileUpload.js"
import otpGenerator from "otp-generator";
import { OTP } from "../models/otp.model.js"

// create function for generate token [JWT] 
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refeshToken = user.generateRefreshToken();

        user.refreshToken = refeshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refeshToken };

    } catch (error) {
        throw new ApiError(
            500,
            error.message,
            "Something went wrong while generating referesh and access token"
        )
    }
}

// ***************** Send OTP Controller ****************
const sendOTP = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists")
    };


    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    console.log("generated otp: ", otp);

    const result = await OTP.findOne({ otp: otp })
    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        result = await OTP.findOne({ otp: otp });
    };

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body: ", otpBody);


    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "Send OTP Successfully")
        );
});

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

    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    // console.log("recent OTP: ", recentOtp);

    if (recentOtp.length == 0) {
        throw new ApiError(400, "OTP not Found!")
    } else if (otp !== recentOtp.otp) {
        throw new ApiError(400, "Invalid OTP")
    }


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

// ************ User Login Controller ************** 
const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username OR email is required")
    };

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(400, "User does not exist")
    };


    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user Credentials")
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const option = {
        httpOnly: true,
        secure: true
    };

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken.option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User Logged In Successfully"
            )
        )

});

// ************** user Refresh Access Token generator controller ************
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incommingRefreshToken = req.cookie.refeshToken;
    if (!incommingRefreshToken) {
        throw new ApiError(401, "UnAuthorized Request!!")
    };

    const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user) {
        throw new ApiError(401, "Invalid refresh token!!!")
    };

    if (incommingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expird or used")
    };

    // Generate new Token 
    const option = {
        httpOnly: true,
        secure: true
    };

    const { newAccessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, option)
        .cookie("refreshToken", newRefreshToken, option)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken, refreshToken: newRefreshToken },
                "Access Token refreshed"
            )
        )

});

// ************* Change Password Controller ************** 
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(user?._id);
    const isPasswordCorrect = await isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old pawword")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password Change Succcessfully")
        )

});


// **************** Get Current User Details *************** 
const getCurrentUserDetails = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            200,
            req.user,
            "Current User Fetched successFully"
        )

});

// *************** Update User Avatar *********** 
const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    };

    const avatar = await uploadImagesOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Error while uploading on avatar")
    };

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User avatar is update successfully"
            )
        );

});


export {
    registerUser,
    sendOTP,
    loginUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUserDetails,
    updateUserAvatar
};