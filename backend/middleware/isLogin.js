import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, resp, next) => {
    try {
        const token = req.cookies.jwt;  
        //console.log("Token:", token);

        if (!token) {
            return resp.status(401).send({ success: false, message: "User Unauthorized - No Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("Decoded JWT:", decoded);  // Check what's inside the token

        // ✅ FIXED: Use await
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return resp.status(404).send({ success: false, message: "User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in isLogin middleware: ${error.message}`);
        resp.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export default isLogin;
