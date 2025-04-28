import jwt from "jsonwebtoken";
import passport from "passport";
import logger from "../../utils/logger.js";
import UsersUsecase from "../../modules/user/user.usecase.js";
import env from "../../config/env.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export default class AuthService {
  constructor() {
    this._usecases = new UsersUsecase();

    this.initializePassport();
  }

  initializePassport() {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: env().JWT_SECRET,
        },
        async (jwtPayload, done) => {
          try {
            const user = await this._usecases.getUserById(jwtPayload.user.id, true);
            if (!user) {
              return done(null, false, { message: "User not found" });
            }
            return done(null, user.data);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  async authenticate(token) {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", (err, user, info) => {
        if (err) {
          return reject(err);
        }
        if (!user) {
          return reject(new Error("Invalid token"));
        }
        resolve(user);
      })({ headers: { authorization: `Bearer ${token}` } });
    });
  }

  async loginUser(username, password) {
    try {
      const userData = await this._usecases.login({
        username,
        password,
      });

      if (!userData.success) {
        return { success: false, error: userData.error };
      }

      const user = userData.data;

      return { success: true, data: user };
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async generateToken(user) {
    try {
      const token = jwt.sign(
        {
          user: {
            username: user.username,
            id: user.id,
          },
        },
        env().JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );

      return { success: true, data: { token } };
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async validateToken(token, secret) {
    if (!token) {
      return { success: false, error: "No token provided" };
    }

    try {
      const decoded = jwt.verify(token, secret);

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return { success: false, error: "Token has expired" };
      }

      return { success: true, decoded };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { success: false, error: "Invalid token" };
      } else if (error instanceof jwt.TokenExpiredError) {
        return { success: false, error: "Token has expired" };
      } else {
        return { success: false, error: "Failed to validate token" };
      }
    }
  }
}
