import mongoose from "mongoose";
import { mailSender } from "../utils/MailSender.js";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 5 * 60
        }
    },
    { timestamps: true }
);

// function for mail send
const sendVerificationEmail = async (email, otp) => {
    try {
        const response = await mailSender(email, "Verification email from StudyNotion", otp);

        console.log("Email send successfully: ", response);

    } catch (error) {
        console.log("Error ocured while sending mail: ", error);
        throw error;
    }
};

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
});

export const OTP = mongoose.model("OTP", otpSchema);