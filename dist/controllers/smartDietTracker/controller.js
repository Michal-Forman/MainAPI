// Library imports
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
// Custom imports
import { User, Food } from "../../models/smartDietTracker/models.js";
// Constants
const openai = new OpenAI(process.env.SMART_DIET_TRACKER_OPENAI_API_KEY);
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
export const logFood = async (req, res) => {
    try {
        const { food } = req.body;
        const bias = "upper";
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Give me calories, protein, carbs and fat for this food: ${food}. Your response should be a JSON in this format: {foodName, calories, protein, carbs, fat}. All the values must be integers, so dont use any suffix or something. Also the food name should be as short as possible`,
                },
            ],
            max_tokens: 100,
            model: "gpt-3.5-turbo-0125",
        });
        const price = completion.usage.prompt_tokens * 0.0000005 +
            completion.usage.completion_tokens * 0.0000015;
        console.log("price:", price);
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { openAICost: price },
            }, { new: true });
        }
        catch (error) {
            console.log("Error in updating the user's openAI usage");
        }
        try {
            console.log("generated message:", completion.choices[0].message.content);
            // Be sure of correct format
            let foodData;
            if (completion.choices[0].message.content.startsWith("`")) {
                foodData = completion.choices[0].message.content.slice(3, -3);
            }
            else {
                foodData = completion.choices[0].message.content;
            }
            console.log("foodData:", foodData);
            let { foodName, calories, protein, carbs, fat } = JSON.parse(foodData);
            // Round the values
            calories = Math.round(calories);
            protein = Math.round(protein);
            carbs = Math.round(carbs);
            fat = Math.round(fat);
            const foodItem = new Food({
                user: req.user._id,
                name: foodName,
                calories,
                protein,
                carbs,
                fat,
            });
            await foodItem.save();
            const { user, ...data } = foodItem.toObject();
            return res.status(201).json({ data });
        }
        catch (error) {
            return res.status(500).send("Error in getting the macros");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error in loggin the food");
    }
};
export const getTodaysFood = async (req, res) => {
    try {
        // Get today's date at midnight in UTC
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);
        // Get tomorrow's date at midnight in UTC (end of today)
        const todayEnd = new Date(todayStart);
        todayEnd.setUTCDate(todayStart.getUTCDate() + 1);
        // Get the food items created today
        const foodItems = await Food.find({
            user: req.user._id,
            time: { $gte: todayStart.toISOString(), $lt: todayEnd.toISOString() },
        });
        // Get totals
        const totals = foodItems.reduce((acc, item) => {
            acc.calories += Math.round(item.calories);
            acc.protein += Math.round(item.protein);
            acc.carbs += Math.round(item.carbs);
            acc.fat += Math.round(item.fat);
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        return res.status(200).json({ totals });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error in getting today's food");
    }
};
export const getAllFood = async (req, res) => {
    try {
        let foodItems = await Food.find({ user: req.user._id }).lean();
        foodItems.forEach((item) => {
            delete item.user;
        });
        return res.status(200).json({ foodItems });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error in getting all food");
    }
};
export const deleteFood = async (req, res) => {
    try {
        const id = req.params.id;
        const foodItem = await Food.findByIdAndDelete(id);
        if (!foodItem) {
            return res.status(404).send("Food not found");
        }
        return res.status(200).send("Food deleted");
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error in deleting the food");
    }
};
export const changeFood = async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const foodItem = await Food.findByIdAndUpdate(id, newData, { new: true });
        if (!foodItem) {
            return res.status(404).send("Food not found");
        }
        return res.status(200).json({ foodItem });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error in changing the food");
    }
};
//# sourceMappingURL=controller.js.map