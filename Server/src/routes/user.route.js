import { Router } from "express";
import { changeCurrentPassword, getCurrentUserDetails, loginUser, refreshAccessToken, registerUser, sendOTP, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getEnrolledCourses, logoutUser, updateProfile } from "../controllers/profile.controller.js";
import { resetPasswordToken, resetPassword } from "../controllers/resetPassword.controller.js"

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser);

router.route('/login').post(loginUser);
router.route('/send-otp').post(sendOTP);

// Secured route 
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUserDetails);
router.route('/avatar').patch(verifyJWT, upload.single('avatar', updateUserAvatar));
router.route('/update-profile').patch(verifyJWT, updateProfile);
router.route('/enrolled-course').get(verifyJWT, getEnrolledCourses);

// Reset Password 
router.route('/reset-password-token').post(resetPasswordToken);
router.route('/reset-password').post(resetPassword);

export default router;