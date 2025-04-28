import Joi from "joi";

export const validateCreateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().pattern(new RegExp("^[a-zA-Z_][a-zA-Z0-9_]{1,19}$")).required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[!@#$%^&*?_\-.,?!:;'“”()\[\]{}+\-×*÷\/=$&*@#%^_|/<>=])[a-zA-Z0-9!@#$%^&*?_\-.,?!:;'“”()\[\]{}+\-×*÷\/=$&*@#%^_|/<>=]{8,30}$/
        )
      )
      .required(),
    userType: Joi.string().valid("individual", "business"),
  });
  return schema.validate(user, { abortEarly: false });
};

export const validateLogin = (user) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user, { abortEarly: false });
};
