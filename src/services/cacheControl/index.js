import RedisCache from "./base.js";
import redisClient from "../../db/redis.js";

const cacheControl = new RedisCache(redisClient);

export default cacheControl;
