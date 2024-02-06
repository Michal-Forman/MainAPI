import mongoose from "mongoose";

const connectSmartDietTrackerDB = async () => {
  try {
    await mongoose.connect(process.env.SMART_DIET_TRACKER_DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection to smart_diet_tracker established");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectSmartDietTrackerDB;
