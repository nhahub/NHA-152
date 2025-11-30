const Seller = require("../../models/Seller");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const User = require("../../models/User");
const CustomProductRequest = require("../../models/CustomProductRequest");
const Cart = require("../../models/Cart");
const mongoose = require("mongoose");

// Get vendor profile by sellerId
const getVendorProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
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

    res.json({
      success: true,
      vendor: seller,
    });
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor profile",
      error: error.message,
    });
  }
};

// Get vendor products by sellerId (exclude custom products)
const getVendorProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    // Exclude custom products from public vendor profile
    const products = await Product.find({ 
      sellerId,
      isCustomProduct: { $ne: true }
    })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor products",
      error: error.message,
    });
  }
};

// Get vendor reviews (reviews for products belonging to this vendor)
const getVendorReviews = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    // First, get all product IDs for this vendor
    const vendorProducts = await Product.find({ sellerId }).select("_id");
    const productIds = vendorProducts.map((p) => p._id.toString());

    // Get all reviews for these products (productId is stored as String in Review model)
    const reviews = await ProductReview.find({
      productId: { $in: productIds },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching vendor reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching vendor reviews",
      error: error.message,
    });
  }
};

// Update vendor profile
const updateVendorProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { storeName, description, profilePic, backgroundImage, allowCustomProducts } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    // Find the seller
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Update fields if provided
    if (storeName !== undefined) {
      seller.storeName = storeName.trim();
    }
    if (description !== undefined) {
      seller.description = description.trim();
    }
    if (profilePic !== undefined) {
      seller.profilePic = profilePic;
    }
    if (backgroundImage !== undefined) {
      seller.backgroundImage = backgroundImage;
    }
    if (allowCustomProducts !== undefined) {
      seller.allowCustomProducts = allowCustomProducts;
    }

    await seller.save();

    res.json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor: seller,
    });
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vendor profile",
      error: error.message,
    });
  }
};

// Get all featured vendors (approved sellers)
const getFeaturedVendors = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const sellers = await Seller.find({ status: "approved" })
      .populate("userId", "userName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      vendors: sellers,
    });
  } catch (error) {
    console.error("Error fetching featured vendors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured vendors",
      error: error.message,
    });
  }
};

// Create custom product request
const createCustomProductRequest = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { userId, userName, userEmail, productDescription, quantity, specialRequirements, estimatedBudget } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    // Check if vendor allows custom products
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (!seller.allowCustomProducts) {
      return res.status(403).json({
        success: false,
        message: "This vendor does not accept custom product requests",
      });
    }

    // Create custom product request
    const customRequest = new CustomProductRequest({
      sellerId,
      userId,
      userName,
      userEmail,
      productDescription,
      quantity: quantity || 1,
      specialRequirements: specialRequirements || "",
      estimatedBudget: estimatedBudget || null,
      status: "pending",
    });

    await customRequest.save();

    res.json({
      success: true,
      message: "Custom product request submitted successfully",
      request: customRequest,
    });
  } catch (error) {
    console.error("Error creating custom product request:", error);
    res.status(500).json({
      success: false,
      message: "Error creating custom product request",
      error: error.message,
    });
  }
};

// Get custom product requests for a vendor
const getCustomProductRequests = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor ID format",
      });
    }

    const requests = await CustomProductRequest.find({ sellerId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching custom product requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom product requests",
      error: error.message,
    });
  }
};

// Accept custom product request
const acceptCustomProductRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { price, title, description, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID format",
      });
    }

    const request = await CustomProductRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Custom product request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Create custom product (only visible to the requesting user)
    const customProduct = new Product({
      sellerId: request.sellerId,
      title: title || `Custom Product - ${request.productDescription.substring(0, 50)}`,
      description: description || request.productDescription,
      image: image || "",
      category: "Custom",
      brand: "Custom",
      price: price || request.estimatedBudget || 0,
      salePrice: 0,
      totalStock: request.quantity || 1,
      averageReview: 0,
      isCustomProduct: true,
      customProductUserId: request.userId,
      customProductRequestId: requestId,
    });

    await customProduct.save();

    // Add product to user's cart
    // Convert userId to ObjectId if it's a string
    const userIdObjectId = mongoose.Types.ObjectId.isValid(request.userId)
      ? new mongoose.Types.ObjectId(request.userId)
      : request.userId;

    let cart = await Cart.findOne({ userId: userIdObjectId });
    if (!cart) {
      cart = new Cart({ userId: userIdObjectId, items: [] });
    }

    const findProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === customProduct._id.toString()
    );

    if (findProductIndex === -1) {
      cart.items.push({ 
        productId: customProduct._id, 
        quantity: request.quantity || 1 
      });
    } else {
      cart.items[findProductIndex].quantity += (request.quantity || 1);
    }

    await cart.save();

    // Update request status
    request.status = "accepted";
    request.vendorResponse = `Custom product created and added to your cart. Price: $${price || request.estimatedBudget || 0}`;
    await request.save();

    res.json({
      success: true,
      message: "Custom product request accepted and product added to user's cart",
      product: customProduct,
      request,
    });
  } catch (error) {
    console.error("Error accepting custom product request:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting custom product request",
      error: error.message,
    });
  }
};

// Reject custom product request
const rejectCustomProductRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { vendorResponse } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID format",
      });
    }

    const request = await CustomProductRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Custom product request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    request.status = "rejected";
    request.vendorResponse = vendorResponse || "Request rejected";
    await request.save();

    res.json({
      success: true,
      message: "Custom product request rejected",
      request,
    });
  } catch (error) {
    console.error("Error rejecting custom product request:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting custom product request",
      error: error.message,
    });
  }
};

module.exports = {
  getVendorProfile,
  getVendorProducts,
  getVendorReviews,
  updateVendorProfile,
  getFeaturedVendors,
  createCustomProductRequest,
  getCustomProductRequests,
  acceptCustomProductRequest,
  rejectCustomProductRequest,
};

