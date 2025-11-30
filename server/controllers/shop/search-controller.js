const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Split keyword into individual words and filter out empty strings
    const keywords = keyword
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (keywords.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Create regex patterns for each keyword (case-insensitive, partial match)
    // This allows matching words that contain the keyword anywhere
    const regexPatterns = keywords.map((word) => new RegExp(word, "i"));

    // Build search query that matches any of the keywords in any of the fields
    // This means if user searches "blue shirt", it will find products with:
    // - "blue" in title/description/category/brand OR
    // - "shirt" in title/description/category/brand
    const searchConditions = [];

    regexPatterns.forEach((pattern) => {
      searchConditions.push(
        { title: pattern },
        { description: pattern },
        { category: pattern },
        { brand: pattern }
      );
    });

    const createSearchQuery = {
      $or: searchConditions,
      isCustomProduct: { $ne: true }, // Exclude custom products from search
    };

    // Fetch all matching products
    const allResults = await Product.find(createSearchQuery);

    // Score and sort results by relevance
    // Products matching more keywords or matching in title (more important) get higher scores
    const scoredResults = allResults.map((product) => {
      let score = 0;
      const titleLower = (product.title || "").toLowerCase();
      const descriptionLower = (product.description || "").toLowerCase();
      const categoryLower = (product.category || "").toLowerCase();
      const brandLower = (product.brand || "").toLowerCase();

      keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();

        // Title matches are most important (highest weight)
        if (titleLower.includes(keywordLower)) {
          score += 10;
          // Bonus if keyword is at the start of title
          if (titleLower.startsWith(keywordLower)) {
            score += 5;
          }
        }

        // Category matches are important
        if (categoryLower.includes(keywordLower)) {
          score += 8;
        }

        // Brand matches are important
        if (brandLower.includes(keywordLower)) {
          score += 7;
        }

        // Description matches are less important
        if (descriptionLower.includes(keywordLower)) {
          score += 3;
        }
      });

      return { product, score };
    });

    // Sort by score (highest first), then by title
    scoredResults.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.product.title || "").localeCompare(b.product.title || "");
    });

    // Extract products from scored results
    const searchResults = scoredResults.map((item) => item.product);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};

module.exports = { searchProducts };
