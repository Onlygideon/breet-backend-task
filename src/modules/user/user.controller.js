import UsersUsecase from "./user.usecase.js";
import ResponseHandler from "../../config/response.js";
import { getAuthService } from "../../services/auth/index.js";
import { validateCreateUser, validateLogin } from "./user.validate.js";

export default class UsersController {
  constructor() {
    this._usecase = new UsersUsecase();
    this._handler = ResponseHandler;

    this._authService = getAuthService();
  }

  async createUser(req, res) {
    try {
      const userData = req.body;

      const { error } = validateCreateUser(userData);
      if (error) {
        if (error.message.startsWith('"password"')) {
          error.message =
            "Password must contain at least one uppercase, lowercase, character and number";
          return this._handler.badRequest(res, error.message);
        } else {
          return this._handler.badRequest(res, error.message);
        }
      }

      userData.username = userData.username.toLowerCase();

      const response = await this._usecase.createUser(userData);
      if (response.success) {
        return this._handler.created(res, response.data);
      }

      return this._handler.badRequest(res, response.error);
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }

  async login(req, res) {
    try {
      const { error } = validateLogin(req.body);
      if (error) {
        return this._handler.badRequest(res, error.message);
      }

      const { username, password } = req.body;

      const checkUser = await this._usecase.getUserByUsername(username);
      if (!checkUser.data) {
        return this._handler.badRequest(res, "Invalid username");
      }

      const userData = await this._authService.loginUser(username, password);
      if (!userData.success) {
        return this._handler.badRequest(res, userData.error);
      }

      const {
        data: { token },
      } = await this._authService.generateToken(userData.data);

      checkUser.data.token = token;

      return this._handler.success(res, checkUser.data);
    } catch (error) {
      return this._handler.internalServerError(res, error.message || error);
    }
  }
}
