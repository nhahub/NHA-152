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
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    profilePic: {
      type: String,
      default: "",
    },
    backgroundImage: {
      type: String,
      default: "",
    },
    allowCustomProducts: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);

