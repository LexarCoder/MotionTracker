const jwt = require("jsonwebtoken");
const blackListModel = require("../model/blacklist.model");
const userModel = require("../model/user.model");

async function userIdentify(req, res, next) {
    try {
        // Extract token from cookies (if user is logged in via browser)
        const token = req.cookies?.token;

        // If token not found, block access
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }

        // Check if token is blacklisted (logout or revoked token)
        const userBlackList = await blackListModel.findOne({ token });

        if (userBlackList) {
            return res.status(401).json({
                success: false,
                message: "User Blacklisted...",
            });
        }

        // Verify JWT token using secret key
        const deCoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Fetch user from DB using decoded user ID
        const user = await userModel
            .findById(deCoded.id)
            .select("-password"); // exclude password for security

        // If user does not exist in DB
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found...",
            });
        }

        // Attach user data to request object for next middleware/routes
        req.user = user;

        // Pass control to next middleware/controller
        next();

    } catch (error) {
        // Token invalid, expired, or tampered
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token",
        });
    }
}

module.exports = userIdentify;