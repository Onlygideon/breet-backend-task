import User from "./user.model.js";

export default class UsersRepo {
  async createUser(user) {
    try {
      const existingUsers = await User.find({ username: user.username });
      if (existingUsers.length > 0) {
        throw new Error("Username already exists, please login or choose another username.");
      }

      const data = await User.create(user);
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const data = await User.findById(id);
      return data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username, withPassword = false) {
    try {
      const data = await User.findOne({ username });
      return withPassword ? data : data ? data.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }
}
