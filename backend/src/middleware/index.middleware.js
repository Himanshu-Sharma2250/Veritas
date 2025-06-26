import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    // get the cookie from the req
    // using jwt 
    try {
        let token = req.cookies.AccessToken || "";

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Authetication Failed"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data : ", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Authentication Error - ", error);
        res.status(500).json({
            success: false,
            message: "Authetication Error"
        })
    }
};