import { asyncHandler } from "../utils/asyncHandler.js";


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

    console.log("fullname: ", fullname);
    console.log("email: ", email)



});

export { registerUser };