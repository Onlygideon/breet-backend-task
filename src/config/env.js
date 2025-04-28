import dotenv from "dotenv";
dotenv.config();

export default () => {
  return {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  };
};
