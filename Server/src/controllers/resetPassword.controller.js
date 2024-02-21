import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { mailSender } from "../utils/MailSender";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";

const resetPasswordToken = asyncHandler(async (rwq, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new ApiError(400, "Your email not register with us")
    };

    const token = crypto.randomUUID();
    const updateUser = await User.findOneAndUpdate(
        { email: email },
        {
            token: token,
            resetPasswordExpire: Date.now() + 3600000
        },
        { new: true }
    );

    // console.log("updated user: ", updateUser);

    const url = `http://localhost:3000/update-password/${token}`;

    await mailSender(
        email,
        "Password Reset",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Email send successfully, Please check email and change password ")
        );

});

const resetPassword = asyncHandler(async (req, res) => {

    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password not matching")
    };

    const user = await user.findOne({ token: token });
    if (!user) {
        throw new ApiError(400, "Token is invalid")
    };

    // token time check 
    if (user.resetPasswordExpire < Date.now()) {
        throw new ApiError(400, "Token is expired, Please regenerate your token")
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
        { token: token },
        { password: hashedPassword },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Password reset successfully")
        );

});

export {
    resetPasswordToken,
    resetPassword
};