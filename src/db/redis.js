import env from "../config/env.js";
import logger from "../utils/logger.js";

import { createClient } from "redis";

const redisPassword = env().REDIS_PASSWORD;
const redisPort = env().REDIS_PORT;
const redisUrl = env().REDIS_URL;

const client = createClient({
  password: redisPassword,
  socket: {
    host: redisUrl,
    port: redisPort,
    connectTimeout: 30000,
  },
});

async function connectRedis() {
  try {
    await client.connect();
    logger.info("Redis Connected");
  } catch (error) {
    logger.error("Redis connection - error: ", error.message);
  }
}

await connectRedis();

export default client;
