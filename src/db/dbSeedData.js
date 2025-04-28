import Product from "../modules/product/product.model.js";

export const TEST_PRODUCTS = [
  { name: "wristwatch silver", price: 15500, stock: 35 },
  { name: "cotton bedsheet set", price: 12000, stock: 25 },
  { name: "office chair", price: 45000, stock: 10 },
  { name: "wooden study table", price: 60000, stock: 8 },
  { name: "makeup brush set", price: 7500, stock: 50 },
  { name: "men polo shirt", price: 8500, stock: 60 },
];

export const seedTesProductInDatabase = async () => {
  try {
    await Product.deleteMany({});

    await Product.insertMany(TEST_PRODUCTS);
    return;
  } catch (error) {
    console.log("error", error);
  }
};
