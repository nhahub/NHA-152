// Script to create an admin user
// Run with: node create-admin.js

require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

// Admin credentials (you can change these)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function createAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: ADMIN_EMAIL },
        { userName: ADMIN_USERNAME }
      ]
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Username: ${existingAdmin.userName}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log("\n💡 You can use these credentials to login:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Password: [the password you set when creating this account]`);
      console.log("\n💡 To create a new admin, either:");
      console.log("   1. Delete the existing admin from the database");
      console.log("   2. Use a different email/username");
      console.log("   3. Update the existing admin's role to 'admin'");
      await mongoose.connection.close();
      return;
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin user
    console.log("👤 Creating admin user...");
    const adminUser = await User.create({
      userName: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("   Email:", ADMIN_EMAIL);
    console.log("   Username:", ADMIN_USERNAME);
    console.log("   Password:", ADMIN_PASSWORD);
    console.log("   Role: admin");
    console.log("\n🔗 You can now login at: http://localhost:5173/auth/login");
    console.log("   After login, you'll be redirected to: http://localhost:5173/admin/dashboard");

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    if (error.code === 11000) {
      console.error("   This email or username is already taken!");
    }
    process.exit(1);
  }
}

// Run the script
createAdmin();

