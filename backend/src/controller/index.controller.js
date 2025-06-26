import {User} from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    // get the username, email, password
    const {username, email, password} = req.body;
    // check if they present
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    if (typeof(password) !== String) {
        console.log("The password must be of type string");
        password = password.toString();
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User already registered'
            })
        }

        const user = await User.create({
            username,
            email,
            password
        });

        const token = crypto.randomBytes(32).toString('hex');

        user.emailVerificationToken = token;
        user.emailTokenExpiry = Date.now() + 1000 * 60;

        await user.save();

        // create a transporter to send the email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, 
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDER,
            to: user.email,
            subject: "To verify your email",
            text: `Click on this URL : ${process.env.BASE_URL}/api/v1/user/verify/${token}`, // plain‑text body
            html: `<h2>Click on this URL</h2>
                    <a href=${process.env.BASE_URL}/api/v1/user/verify/${token}}>Click here</a>`, // HTML body
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success:true,
            message: "User registration completed",
            user
        })
    } catch (error) {
        console.error("Error registering user- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user"
        })
    }
}

export const verifyUser = async (req, res) => {
    try {
        const { token } = req.params;
        
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return res.status(400).json({ error: "Invalid verification token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null; // Clear token

        await user.save();

        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    // get the email and password
    // validate the email and password
    // get the user and validate
    // match if the password is same
    // create a jwt token and store it in cookie
    if (!req.body) {
        console.log("body doesnot exist");
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            success:false,
            message: "All fields required"
        })
    }

    try {
        const user = await User.findOne({email:email});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        console.log("Password given : ", password);
        console.log("Password stored : ", user.password);
        console.log("User detail : ", user.email);

        const isMatch = await bcrypt.compare(password.toString(), user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Either Email or Password is wrong"
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        const cookieOption = {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }

        res.cookie("AccessToken", token, cookieOption);

        res.status(200).json({
            success: true,
            message: "User login successful",
            token,
            user: {
                id: user._id,
                name: user.username,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Error in user login - ", error);
        res.status(500).json({
            success: false,
            message: "Error in User login"
        })
    }
}

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User profile:",
            user
        })
    } catch (error) {
        console.error("Error in getting Profile - ", error);
        res.status(500).json({
            success: false,
            message: "Error in getting Profile"
        })
    }
}

export const logoutUser = async (req, res) => {
    // check if user logged in
    // then remove the cookie token
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user logged out or doesnot exist"
            })
        }

        res.cookie("AccessToken", "", {
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error("Error in log out -", error);
        res.status(500).json({
            success: false,
            message: "Error in logout"
        })
    }
}

export const forgotPassword = async (req, res) => {
    // get the email 
    // validate the email 
    // find the user using email
    // send the email
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.forgetPasswordToken = token;
        user.forgetPasswordExpiry = Date.now() + 1000 * 60 * 60;

        await user.save();

        // create a transporter to send the email
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, 
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAILTRAP_SENDER,
            to: user.email,
            subject: "To reset your password",
            text: `Click on this URL : ${process.env.BASE_URL}/api/v1/user/resetPassword/${token}`, // plain‑text body
            html: `<h2>Click on this URL</h2>
                    <a href=${process.env.BASE_URL}/api/v1/user/resetPassword/${token}}>Click here</a>`, // HTML body
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "forget password email send"
        })
    } catch (error) {
        console.error("Error in forgetpassword - ", error);
        res.status(500).json({
            success: false,
            message: "Error in forgot password"
        })
    }
}

export const resetPassword = async (req, res) => {
    // get new password and confirm password and token
    // validate
    // updatet the password
    const {newPassword, confirmPassword} = req.body;
    const {token} = req.params;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields required"
        })
    }

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Invalid Token"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Confirmed password should be equal to new Password"
        })
    }

    try {
        const user = await User.findOne({
            forgetPasswordToken: token,
            forgetPasswordExpiry: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        user.password = newPassword;
        user.forgetPasswordExpiry = new Date();
        user.forgetPasswordToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
            user
        })
    } catch (error) {
        console.error('Error in reseting password', error);
        res.status(500).json({
            success: false,
            message: "Error in reseting password"
        })
    }
}