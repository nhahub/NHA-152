// Load environment variables from .env file if it exists
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopSellerRouter = require("./routes/shop/seller-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");


//create a database connection -> u can also
//create a separate file for this and then import/use that file here

// TODO: Replace this connection string with your MongoDB Atlas connection string
// Format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
// Get it from MongoDB Atlas: Database > Connect > Connect your application

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rawdafakhry6_db_user:9905@cluster0.hx8mjci.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("Please check your connection string in server.js or .env file");
  });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/seller", shopSellerRouter);

app.use("/api/common/feature", commonFeatureRouter);


app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
