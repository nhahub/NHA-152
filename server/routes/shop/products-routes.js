const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getProductsWithOffers,
  getLatestProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/offers", getProductsWithOffers);
router.get("/latest", getLatestProducts);

module.exports = router;
