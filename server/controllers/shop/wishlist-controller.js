const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");
const mongoose = require("mongoose");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID or Product ID format",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create wishlist for user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        userId,
        products: [{ productId }],
      });
      await wishlist.save();
    } else {
      // Check if product already exists in wishlist
      const productExists = wishlist.products.some(
        (item) => item.productId.toString() === productId
      );

      if (productExists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist",
        });
      }

      // Add product to wishlist
      wishlist.products.push({ productId });
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID or Product ID format",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format",
      });
    }

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
          products: [],
        },
      });
    }

    // Filter out any null products (in case product was deleted)
    const validProducts = wishlist.products.filter((item) => item.productId);

    // Get reviews count for each product
    const productsWithReviews = await Promise.all(
      validProducts.map(async (item) => {
        const product = item.productId.toObject ? item.productId.toObject() : item.productId;
        const reviewsCount = await ProductReview.countDocuments({ productId: product._id });
        return {
          ...product,
          reviews: reviewsCount,
          reviewsCount: reviewsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        userId: wishlist.userId,
        products: productsWithReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID or Product ID format",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        isInWishlist: false,
      });
    }

    const isInWishlist = wishlist.products.some(
      (item) => item.productId.toString() === productId
    );

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking wishlist status",
      error: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
};

