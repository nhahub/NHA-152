const mongoose = require("mongoose");

const CustomProductRequestSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    specialRequirements: {
      type: String,
      default: "",
    },
    estimatedBudget: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected", "completed"],
      default: "pending",
    },
    vendorResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomProductRequest", CustomProductRequestSchema);

