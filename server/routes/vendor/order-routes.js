const express = require("express");
const {
  getVendorOrders,
  getVendorOrderDetails,
  updateVendorOrderStatus,
} = require("../../controllers/vendor/order-controller");

const router = express.Router();

// Get all orders for a vendor
router.get("/get/:sellerId", getVendorOrders);

// Get order details
router.get("/details/:sellerId/:orderId", getVendorOrderDetails);

// Update order status
router.put("/update/:sellerId/:orderId", updateVendorOrderStatus);

module.exports = router;


