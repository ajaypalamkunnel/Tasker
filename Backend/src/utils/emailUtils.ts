import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
    },
});

export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        const mailOptions = {
            from: `Tasker${config.smtp_user} `,
            to: email,
            subject: "Your OTP Code from WellCare",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px; text-align: center;">
                    <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0px 6px 20px rgba(0,0,0,0.1); overflow: hidden;">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(90deg, #03C03C, #02a52f); padding: 20px;">
                            <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Articlio News Feeds</h2>
                        </div>
                        
                        <!-- Body -->
                        <div style="padding: 25px;">
                            <p style="font-size: 17px; color: #333; margin-bottom: 8px;">Your One-Time Password (OTP)</p>
                            <h1 style="font-size: 40px; color: #03C03C; margin: 15px 0; letter-spacing: 3px;">${otp}</h1>
                            <p style="font-size: 15px; color: #555;">Use this OTP to verify your account. This code will expire in <strong>10 minutes</strong>.</p>
                        </div>

                        <!-- Footer -->
                        <div style="padding: 15px; background-color: #f1f1f1; font-size: 13px; color: #777;">
                            If you didn’t request this OTP, please ignore this email.
                        </div>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) { 
        console.error("Error sending email:", error);
    }
};
