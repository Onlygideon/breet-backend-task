import logger from "../../utils/logger.js";

export default class RedisCache {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async set(key, data, expiryInSeconds = 300) {
    const value = JSON.stringify(data);
    try {
      await this.redis.setEx(key, expiryInSeconds, value);
    } catch (error) {
      logger.error(`Failed to cache data for ${key} - error: ${error}`);
      throw error;
    }
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      if (data) {
        return JSON.parse(data);
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`Failed to fetch cached data for ${key} - error: ${error}`);
      throw error;
    }
  }

  async expireKey(key, expiryInSeconds) {
    try {
      await this.redis.expire(key, expiryInSeconds);
    } catch (error) {
      logger.error(`Failed to set expiry time for cache data of ${key} - error: ${error}`);
      throw error;
    }
  }

  async exists(key) {
    try {
      const keyExists = await this.redis.exists(key);
      return keyExists ? true : false;
    } catch (error) {
      logger.error(`Failed to check if cache key: ${key} exists - error: ${error}`);
      throw error;
    }
  }

  async deleteKey(key) {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error(`Failed to delete key ${key} - error: ${error}`);
      throw error;
    }
  }
}
