import AuthService from "./base.js";

export const getAuthService = () => {
  return new AuthService();
};
