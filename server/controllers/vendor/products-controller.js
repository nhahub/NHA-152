const Product = require("../../models/Product");
const Seller = require("../../models/Seller");
const mongoose = require("mongoose");

// Add product (vendor can only add to their own store)
const addProduct = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    // Validate sellerId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    // Check if seller exists and is approved
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (seller.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is not approved yet",
      });
    }

    // Create product with sellerId
    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice: salePrice || 0,
      totalStock: totalStock || 0,
      averageReview: 0,
      sellerId,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Get vendor's products
const getVendorProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller ID format",
      });
    }

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Edit vendor's product
const editProduct = async (req, res) => {
  try {
    const { sellerId, productId } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Find product and verify it belongs to this vendor
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this product",
      });
    }

    // Update product
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price !== undefined ? price : product.price;
    product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;
    product.totalStock = totalStock !== undefined ? totalStock : product.totalStock;
    product.image = image || product.image;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({
      success: false,
      message: "Error editing product",
      error: error.message,
    });
  }
};

// Delete vendor's product
const deleteProduct = async (req, res) => {
  try {
    const { sellerId, productId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Find product and verify it belongs to this vendor
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this product",
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getVendorProducts,
  editProduct,
  deleteProduct,
};


