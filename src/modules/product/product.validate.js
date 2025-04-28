import Joi from "joi";

export const validateCreateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(1).required(),
  });
  return schema.validate(product, { abortEarly: false });
};

export const validateUpdateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    stock: Joi.number().integer().min(0).optional(),
  })
    .min(1)
    .messages({
      "object.min": "At least one of name, price, or stock must be provided.",
    });
  return schema.validate(product, { abortEarly: false });
};
