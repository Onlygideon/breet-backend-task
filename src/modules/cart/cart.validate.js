import Joi from "joi";

export const validateAddItemsToCart = (product) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string()
            .hex()
            .length(24)
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  });

  return schema.validate(product, { abortEarly: false });
};
