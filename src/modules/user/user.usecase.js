import UsersRepo from "./user.repo.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default class UsersUsecase {
  constructor() {
    this._repo = new UsersRepo();
  }

  async createUser(user) {
    try {
      const salt = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(user.password + salt, 10);
      user.salt = salt;
      user.password = hashedPassword;

      user.username = user.username.replace(/\s+/g, " ").trim().toLowerCase();

      await this._repo.createUser(user);

      return {
        success: true,
        data: "User Signed Up Successfully!",
      };
    } catch (error) {
      logger.error(error.message);
      if (error.code === 11000) {
        return {
          success: false,
          error: `A user with this username already exists`,
        };
      } else {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }

  async login(user) {
    try {
      const userData = await this._repo.getUserByUsername(
        String(user.username).toLowerCase(),
        true
      );

      if (!userData) {
        return {
          success: false,
          error: "Invalid username",
        };
      }

      const isPasswordValid = bcrypt.compareSync(user.password + userData.salt, userData.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Incorrect Password",
        };
      }

      return { success: true, data: userData };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserById(id) {
    try {
      let data = await this._repo.getUserById(id);

      if (!data) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserByUsername(username) {
    try {
      const data = await this._repo.getUserByUsername(String(username).toLowerCase());
      if (!data) {
        return {
          success: false,
          error: "User not found",
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
