const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    author: {
      type: String,
      default: "Admin",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt from content if not provided
articleSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    // Take first 150 characters as excerpt
    this.excerpt = this.content.substring(0, 150).trim() + "...";
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);

