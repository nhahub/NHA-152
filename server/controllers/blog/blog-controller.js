const Article = require("../../models/Article");
const mongoose = require("mongoose");

// Get all articles (with optional filtering)
const getAllArticles = async (req, res) => {
  try {
    const { category, published, limit, page } = req.query;
    
    let filters = {};
    
    // Filter by category if provided
    if (category) {
      filters.category = category;
    }
    
    // Filter by published status (default to published only for public access)
    if (published !== undefined) {
      filters.published = published === "true";
    } else {
      filters.published = true; // Default to only published articles
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Get articles
    const articles = await Article.find(filters)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limitNum)
      .populate("authorId", "username email")
      .select("-content"); // Don't send full content in list
    
    // Get total count for pagination
    const total = await Article.countDocuments(filters);
    
    res.json({
      success: true,
      articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};

// Get single article by ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id)
      .populate("authorId", "username email");
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    // Increment views
    article.views += 1;
    await article.save();
    
    res.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, image, category, author, authorId, published, tags } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    
    // Validate authorId if provided (must be valid ObjectId)
    let validAuthorId = null;
    if (authorId) {
      if (mongoose.Types.ObjectId.isValid(authorId)) {
        validAuthorId = authorId;
      } else {
        console.warn(`Invalid authorId provided: ${authorId}`);
        // Continue without authorId rather than failing
      }
    }
    
    // Create article
    const article = new Article({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt ? excerpt.trim() : "",
      image: image ? image.trim() : "",
      category: category || "General",
      author: author || "Admin",
      authorId: validAuthorId,
      published: published !== undefined ? published : false,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()).filter(t => t) : []),
    });
    
    await article.save();
    
    res.status(201).json({
      success: true,
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: messages,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: error.message,
    });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    res.json({
      success: true,
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: error.message,
    });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByIdAndDelete(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }
    
    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

