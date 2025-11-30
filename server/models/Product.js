const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },
    isCustomProduct: {
      type: Boolean,
      default: false,
    },
    customProductUserId: {
      type: String,
      default: null,
    },
    customProductRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomProductRequest",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
