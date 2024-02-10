import jwt from "jsonwebtoken";
import { User } from "../../models/smartDietTracker/models.js";
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.sendStatus(401); // It's more common to check for falsy values like this
    jwt.verify(token, process.env.SMART_DIET_TRACKER_JWT_SECRET, async (err, payload) => {
        if (err)
            return res.sendStatus(403); // Forbidden if there's an error verifying the token
        try {
            const { email } = payload; // Ensure payload is used, not 'user'
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.sendStatus(404); // Not Found, if no user matches the email
            }
            req.user = user; // Attach the user document to the request object
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            console.error("Database error:", error);
            return res.sendStatus(500); // Server error
        }
    });
};
//# sourceMappingURL=middlewares.js.map