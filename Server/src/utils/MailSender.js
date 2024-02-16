import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
    try {
        // transporter 
        let transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            }
        );

        // send mail 
        let info = await transporter.sendMail(
            {
                from: `StudyNotion - Sandy`,
                to: `${email}`,
                subject: `${title}`,
                html: `${body}`
            }
        );

        console.log("Info:", info);
        return info;

    } catch (error) {
        console.log(error.message);
    }
}

export { mailSender };