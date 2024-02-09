// Library imports
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Custom imports
import { User } from "../../models/smartDietTracker/models.js";
export const createUser = async (req, res) => {
    // Register the user
    try {
        const { email, firstName, lastName, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });
        await user.save();
        // Generate the token
        try {
            const token = jwt.sign({ email: email }, process.env.SMART_DIET_TRACKER_JWT_SECRET, {
                expiresIn: "24h",
            });
            res.status(201).json({ token });
        }
        catch (error) {
            res.status(500).send("Error in generating token");
        }
    }
    catch (e) {
        const answer = "Error in creating user";
        res.status(500).send(answer);
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Check the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid credentials");
        }
        // Generate the token
        try {
            const token = jwt.sign({ email: user.email }, process.env.SMART_DIET_TRACKER_JWT_SECRET, {
                expiresIn: "24h",
            });
            return res.status(200).json({ token });
        }
        catch (error) {
            return res.status(500).send("Error in generating token");
        }
    }
    catch (error) {
        return res.status(500).send("Error in user login");
    }
};
//# sourceMappingURL=controller.js.map