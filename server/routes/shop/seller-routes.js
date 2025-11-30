const express = require("express");
const {
  createSellerApplication,
  getSellerApplication,
} = require("../../controllers/shop/seller-controller");

const router = express.Router();

router.post("/", createSellerApplication);
router.get("/:userId", getSellerApplication);

module.exports = router;

