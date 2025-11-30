const Seller = require("../../models/Seller");
const User = require("../../models/User");

const createSellerApplication = async (req, res) => {
  try {
    const { userId, storeName, phone, businessType, storeCategory, description } = req.body;

    if (!userId || !storeName || !phone || !businessType || !storeCategory || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already has a seller application
    const existingSeller = await Seller.findOne({ userId });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "You already have a seller application. Please wait for approval.",
      });
    }

    // Create seller application
    const seller = new Seller({
      userId,
      storeName,
      phone,
      businessType,
      storeCategory,
      description,
      status: "pending",
    });

    await seller.save();

    res.status(201).json({
      success: true,
      message: "Seller application submitted successfully! We will review your application shortly.",
      data: seller,
    });
  } catch (error) {
    console.log("Error creating seller application:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting seller application",
      error: error.message,
    });
  }
};

const getSellerApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const seller = await Seller.findOne({ userId }).populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.log("Error fetching seller application:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching seller application",
      error: error.message,
    });
  }
};

module.exports = {
  createSellerApplication,
  getSellerApplication,
};

