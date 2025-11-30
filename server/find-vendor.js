// Script to find vendor account details by sellerId
// Usage: node find-vendor.js <sellerId>

require('dotenv').config();
const mongoose = require("mongoose");
const Seller = require("./models/Seller");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

const sellerId = process.argv[2] || "691c83720b4b3b79666bb5c3";

async function findVendor() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log(`🔍 Searching for vendor with Seller ID: ${sellerId}\n`);

    const seller = await Seller.findById(sellerId).populate("userId", "userName email role");

    if (!seller) {
      console.log("❌ Vendor not found with that Seller ID");
      await mongoose.connection.close();
      return;
    }

    console.log("✅ Vendor Found!\n");
    console.log("=".repeat(60));
    console.log("📋 VENDOR ACCOUNT DETAILS");
    console.log("=".repeat(60));
    console.log(`\n🏪 Store Name: ${seller.storeName}`);
    console.log(`📧 Email: ${seller.userId?.email || "N/A"}`);
    console.log(`👤 Username: ${seller.userId?.userName || "N/A"}`);
    console.log(`📞 Phone: ${seller.phone || "N/A"}`);
    console.log(`🏢 Business Type: ${seller.businessType || "N/A"}`);
    console.log(`📂 Store Category: ${seller.storeCategory || "N/A"}`);
    console.log(`📝 Description: ${seller.description || "N/A"}`);
    console.log(`✅ Status: ${seller.status || "N/A"}`);
    console.log(`🆔 Seller ID: ${seller._id}`);
    console.log(`🆔 User ID: ${seller.userId?._id || "N/A"}`);
    console.log(`\n🔗 Profile URL: http://localhost:5173/shop/vendor/${seller._id}`);
    console.log("\n" + "=".repeat(60));

    // Check if there's a password hint (we can't retrieve passwords, but we can check seed data)
    console.log("\n💡 Login Credentials:");
    console.log("   Note: Passwords are hashed and cannot be retrieved.");
    console.log("   If this vendor was created via seed-vendors.js, the password is likely: vendor123");
    console.log(`   Email: ${seller.userId?.email || "N/A"}`);

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error finding vendor:", error);
    process.exit(1);
  }
}

findVendor();

