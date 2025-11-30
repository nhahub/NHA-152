const Order = require("../../models/Order");
const Seller = require("../../models/Seller");
const Product = require("../../models/Product");

// Get admin dashboard statistics
const getAdminStatistics = async (req, res) => {
  try {
    // Get total number of approved vendors
    const totalVendors = await Seller.countDocuments({ status: "approved" });
    
    // Get total number of pending vendors
    const pendingVendors = await Seller.countDocuments({ status: "pending" });
    
    // Get all orders
    const allOrders = await Order.find({});
    
    // Calculate total revenue (sum of all order totalAmount)
    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);
    
    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // Get orders from this month
    const monthlyOrders = allOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfMonth && orderDate <= endOfMonth;
    });
    
    // Calculate monthly revenue
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);
    
    // Get total number of orders
    const totalOrders = allOrders.length;
    
    // Get number of sales this month
    const monthlySales = monthlyOrders.length;
    
    // Get total number of products
    const totalProducts = await Product.countDocuments({});
    
    // Get orders by status
    const confirmedOrders = allOrders.filter(order => order.orderStatus === "confirmed").length;
    const pendingOrders = allOrders.filter(order => order.orderStatus === "pending").length;
    const cancelledOrders = allOrders.filter(order => order.orderStatus === "cancelled").length;
    
    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.status(200).json({
      success: true,
      data: {
        vendors: {
          total: totalVendors,
          pending: pendingVendors,
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
        },
        orders: {
          total: totalOrders,
          monthly: monthlySales,
          confirmed: confirmedOrders,
          pending: pendingOrders,
          cancelled: cancelledOrders,
        },
        products: {
          total: totalProducts,
        },
        averageOrderValue: averageOrderValue,
      },
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAdminStatistics,
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
