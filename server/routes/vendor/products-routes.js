const express = require("express");
const {
  addProduct,
  getVendorProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/vendor/products-controller");

const router = express.Router();

// Add product
router.post("/add/:sellerId", addProduct);

// Get vendor's products
router.get("/get/:sellerId", getVendorProducts);

// Edit product
router.put("/edit/:sellerId/:productId", editProduct);

// Delete product
router.delete("/delete/:sellerId/:productId", deleteProduct);

module.exports = router;


