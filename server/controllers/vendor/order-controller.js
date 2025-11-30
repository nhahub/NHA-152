const Order = require("../../models/Order");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

// Get all orders for a vendor (orders containing products from this vendor)
const getVendorOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    // Get all product IDs for this vendor
    const vendorProducts = await Product.find({ sellerId }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id.toString());

    if (vendorProductIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No products found for this vendor",
      });
    }

    // Find all orders that contain at least one product from this vendor
    const allOrders = await Order.find({});
    
    // Filter orders to only include those with vendor's products
    const vendorOrders = allOrders.filter((order) => {
      return order.cartItems.some((item) =>
        vendorProductIds.includes(item.productId)
      );
    });

    // Enrich orders with vendor-specific product information
    const enrichedOrders = vendorOrders.map((order) => {
      const vendorItems = order.cartItems.filter((item) =>
        vendorProductIds.includes(item.productId)
      );
      const vendorTotal = vendorItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );

      return {
        ...order.toObject(),
        vendorItems,
        vendorTotal,
        totalItems: vendorItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedOrders,
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor orders",
      error: error.message,
    });
  }
};

// Get order details for vendor
const getVendorOrderDetails = async (req, res) => {
  try {
    const { sellerId, orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get vendor's product IDs
    const vendorProducts = await Product.find({ sellerId }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id.toString());

    // Filter cart items to only show vendor's products
    const vendorItems = order.cartItems.filter((item) =>
      vendorProductIds.includes(item.productId)
    );

    if (vendorItems.length === 0) {
      return res.status(403).json({
        success: false,
        message: "This order does not contain any products from this vendor",
      });
    }

    const vendorTotal = vendorItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        vendorItems,
        vendorTotal,
        totalItems: vendorItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching vendor order details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};

// Update order status (vendor can update status of their orders)
const updateVendorOrderStatus = async (req, res) => {
  try {
    const { sellerId, orderId } = req.params;
    const { orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify that this order contains products from this vendor
    const vendorProducts = await Product.find({ sellerId }).select("_id");
    const vendorProductIds = vendorProducts.map((p) => p._id.toString());

    const hasVendorProducts = order.cartItems.some((item) =>
      vendorProductIds.includes(item.productId)
    );

    if (!hasVendorProducts) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this order",
      });
    }

    await Order.findByIdAndUpdate(orderId, {
      orderStatus,
      orderUpdateDate: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

module.exports = {
  getVendorOrders,
  getVendorOrderDetails,
  updateVendorOrderStatus,
};


