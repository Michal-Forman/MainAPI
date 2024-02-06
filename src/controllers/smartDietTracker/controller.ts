// Library imports
import "dotenv/config";
import { Request, Response } from "express";
import bycrypt from "bcryptjs";

// Custom imports
import { User } from "../../models/smartDietTracker/models.js";

export const getTestingData = (req: Request, res: Response) => {
  res.send("Testing Data is this");
};

export const createUser = async (req: Request, res: Response) => {
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
  } catch (e) {
    const answer = "Error in creating user";
    res.status(500).send(answer);
  }
};
