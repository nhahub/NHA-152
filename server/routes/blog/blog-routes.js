const express = require("express");
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../../controllers/blog/blog-controller");

const router = express.Router();

// Get all articles
router.get("/get", getAllArticles);

// Get single article by ID
router.get("/get/:id", getArticleById);

// Create new article
router.post("/create", createArticle);

// Update article
router.put("/update/:id", updateArticle);

// Delete article
router.delete("/delete/:id", deleteArticle);

module.exports = router;

