import UsersUsecase from "../modules/user/user.usecase.js";
import env from "../config/env.js";
import ResponseHandler from "../config/response.js";

export const authorize = (authService) => async (req, res, next) => {
  try {
    const userUsecase = new UsersUsecase();

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return ResponseHandler.unauthorized(res, "Authentication Token is required!");
    }

    const isValidToken = await authService.validateToken(token, env().JWT_SECRET);
    if (!isValidToken.success) {
      return ResponseHandler.unauthorized(res, "Invalid Authentication Token!");
    }

    const user = (await userUsecase.getUserById(isValidToken.decoded.user.id)).data;

    req.user = user;
    return next();
  } catch (error) {
    return ResponseHandler.internalServerError(res, "Internal Server Error");
  }
};
