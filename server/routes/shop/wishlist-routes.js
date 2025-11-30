const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
} = require("../../controllers/shop/wishlist-controller");

const router = express.Router();

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.post("/remove", removeFromWishlist);

// Get user's wishlist
router.get("/get/:userId", getWishlist);

// Check if product is in wishlist
router.get("/check", checkWishlistStatus);

module.exports = router;

