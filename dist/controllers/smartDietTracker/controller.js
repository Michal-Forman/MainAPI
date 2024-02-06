// Library imports
import "dotenv/config";
import bycrypt from "bcryptjs";
// Custom imports
import { User } from "../../models/smartDietTracker/models.js";
export const getTestingData = (req, res) => {
    res.send("Testing Data is this");
};
export const createUser = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        const hashedPassword = await bycrypt.hash(password, 12);
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).send("User Created");
    }
    catch (e) {
        const answer = "Error in creating user";
        res.status(500).send(answer);
    }
};
//# sourceMappingURL=controller.js.map