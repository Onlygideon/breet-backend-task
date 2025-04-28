import mongoose from "mongoose";
import env from "../config/env.js";
import logger from "../utils/logger.js";

let { MONGO_URI } = env();

export const mongoRemote = MONGO_URI;

const localDbName = process.env.NODE_ENV == "test" ? "breet-test" : "breet";

const mongoLocal = `mongodb://localhost:27017/${localDbName}`;

export const connectMongodb = async () => {
  try {
    mongoose.set("strictQuery", false);

    if (mongoRemote && process.env.NODE_ENV !== "test") {
      await mongoose.connect(mongoRemote, {});
      logger.info("MongoDb Connected Successfully!");
    } else {
      await mongoose.connect(mongoLocal);
      logger.info("Local MongoDB connected");
    }
  } catch (err) {
    logger.error(`MongoDB connection: ${err} `);
  }
};
