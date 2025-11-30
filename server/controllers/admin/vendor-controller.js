const Seller = require("../../models/Seller");
const Product = require("../../models/Product");
const User = require("../../models/User");
const mongoose = require("mongoose");

// Get all vendors (with filters)
const getAllVendors = async (req, res) => {
  try {
    const { status } = req.query;
    let filters = {};

    if (status) {
      filters.status = status;
    }

    const vendors = await Seller.find(filters)
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendors",
      error: error.message,
    });
  }
};

// Get pending vendor applications
const getPendingVendors = async (req, res) => {
  try {
    const vendors = await Seller.find({ status: "pending" })
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching pending vendors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending vendors",
      error: error.message,
    });
  }
};

// Approve vendor application
const approveVendor = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status: "approved" },
      { new: true }
    ).populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({
      success: false,
      message: "Error approving vendor",
      error: error.message,
    });
  }
};

// Reject vendor application
const rejectVendor = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status: "rejected" },
      { new: true }
    ).populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor application rejected",
      data: seller,
    });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting vendor",
      error: error.message,
    });
  }
};

// Suspend vendor
const suspendVendor = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status: "suspended" },
      { new: true }
    ).populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor suspended successfully",
      data: seller,
    });
  } catch (error) {
    console.error("Error suspending vendor:", error);
    res.status(500).json({
      success: false,
      message: "Error suspending vendor",
      error: error.message,
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Delete all products associated with this vendor
    await Product.deleteMany({ sellerId });

    // Delete the vendor
    await Seller.findByIdAndDelete(sellerId);

    res.status(200).json({
      success: true,
      message: "Vendor and associated products deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting vendor",
      error: error.message,
    });
  }
};

// Get vendor details
const getVendorDetails = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const seller = await Seller.findById(sellerId)
      .populate("userId", "userName email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({ sellerId });

    res.status(200).json({
      success: true,
      data: {
        ...seller.toObject(),
        productCount,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor details",
      error: error.message,
    });
  }
};

module.exports = {
  getAllVendors,
  getPendingVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  deleteVendor,
  getVendorDetails,
};


