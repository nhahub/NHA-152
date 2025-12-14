// Load environment variables from .env file if it exists
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminVendorRouter = require("./routes/admin/vendor-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopSellerRouter = require("./routes/shop/seller-routes");
const shopVendorRouter = require("./routes/shop/vendor-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");
const vendorProductsRouter = require("./routes/vendor/products-routes");
const vendorOrdersRouter = require("./routes/vendor/order-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const blogRouter = require("./routes/blog/blog-routes");

const nodemailer = require("nodemailer"); // <-- إضافة Nodemailer

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
};

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Please set it in your .env file.");
    }

    const conn = await mongoose.connect(MONGODB_URI, mongooseOptions);
    
    console.log("✅ MongoDB connected successfully");
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on('reconnected', () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Please check your connection string in .env file or server.js");
    console.error("Error details:", error);
    console.warn("⚠️  Server will continue to run. MongoDB will attempt to reconnect...");
  }
};

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
    "X-Requested-With",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/vendors", adminVendorRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/seller", shopSellerRouter);
app.use("/api/vendor", shopVendorRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);
app.use("/api/vendor/products", vendorProductsRouter);
app.use("/api/vendor/orders", vendorOrdersRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/blog", blogRouter);

// --------------------
// Route لإرسال الإيميل
// --------------------
app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // الإيميل اللي حطيته في .env
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      text: message,
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
