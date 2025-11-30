const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    // Exclude custom products from public listings
    filters.isCustomProduct = { $ne: true };
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Get products with offers (salePrice > 0)
const getProductsWithOffers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    // Exclude custom products from public listings
    const products = await Product.find({
      salePrice: { $gt: 0 },
      isCustomProduct: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error fetching products with offers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products with offers",
      error: error.message,
    });
  }
};

// Get latest products
const getLatestProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    // Exclude custom products from public listings
    const products = await Product.find({
      isCustomProduct: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error fetching latest products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching latest products",
      error: error.message,
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails, getProductsWithOffers, getLatestProducts };
