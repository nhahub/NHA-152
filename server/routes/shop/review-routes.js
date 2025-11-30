const express = require("express");

const {
  addProductReview,
  getProductReviews,
  getRecentReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/recent", getRecentReviews);
router.get("/:productId", getProductReviews);

module.exports = router;
