const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["individual", "company", "partnership"],
    },
    storeCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);

