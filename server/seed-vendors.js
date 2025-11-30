// Script to create test vendor accounts with products and reviews
// Run with: node seed-vendors.js

require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Seller = require("./models/Seller");
const Product = require("./models/Product");
const Review = require("./models/Review");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

// Sample vendor data
const vendors = [
  {
    userName: "techstore_vendor",
    email: "techstore@example.com",
    password: "vendor123",
    storeName: "TechStore Pro",
    phone: "+1-555-0101",
    businessType: "company",
    storeCategory: "Electronics",
    description: "Your one-stop shop for the latest tech gadgets and electronics. We offer premium quality products with excellent customer service.",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop",
  },
  {
    userName: "fashionboutique",
    email: "fashion@example.com",
    password: "vendor123",
    storeName: "Fashion Boutique",
    phone: "+1-555-0102",
    businessType: "individual",
    storeCategory: "Fashion",
    description: "Trendy and stylish fashion items for the modern wardrobe. From casual wear to formal attire, we have it all.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop",
  },
  {
    userName: "home_decor_plus",
    email: "homedecor@example.com",
    password: "vendor123",
    storeName: "Home Decor Plus",
    phone: "+1-555-0103",
    businessType: "company",
    storeCategory: "Home & Living",
    description: "Transform your living space with our curated collection of home decor items. Quality furniture and accessories for every room.",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format&fit=crop",
  },
  {
    userName: "sports_gear_hub",
    email: "sports@example.com",
    password: "vendor123",
    storeName: "Sports Gear Hub",
    phone: "+1-555-0104",
    businessType: "partnership",
    storeCategory: "Sports & Outdoors",
    description: "Premium sports equipment and outdoor gear for athletes and adventure enthusiasts. Gear up for your next adventure!",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1920&auto=format&fit=crop",
  },
  {
    userName: "beauty_essentials",
    email: "beauty@example.com",
    password: "vendor123",
    storeName: "Beauty Essentials",
    phone: "+1-555-0105",
    businessType: "individual",
    storeCategory: "Beauty & Personal Care",
    description: "Discover your beauty with our premium skincare and makeup products. Natural ingredients for a radiant you.",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1920&auto=format&fit=crop",
  },
];

// Product templates by category
const productTemplates = {
  Electronics: [
    { title: "Wireless Bluetooth Headphones", price: 89, salePrice: 69, brand: "TechSound" },
    { title: "Smart Watch Series 5", price: 249, salePrice: 199, brand: "TechTime" },
    { title: "Portable Power Bank 20000mAh", price: 39, salePrice: null, brand: "PowerMax" },
    { title: "USB-C Laptop Charger", price: 29, salePrice: 19, brand: "ChargePro" },
    { title: "Wireless Mouse", price: 25, salePrice: null, brand: "TechMouse" },
  ],
  Fashion: [
    { title: "Classic Denim Jacket", price: 79, salePrice: 59, brand: "FashionCo" },
    { title: "Designer Leather Boots", price: 149, salePrice: 119, brand: "FootStyle" },
    { title: "Silk Scarf Collection", price: 35, salePrice: null, brand: "Elegance" },
    { title: "Vintage Sunglasses", price: 45, salePrice: 35, brand: "SunStyle" },
    { title: "Wool Winter Coat", price: 199, salePrice: 159, brand: "WarmWear" },
  ],
  "Home & Living": [
    { title: "Modern Coffee Table", price: 299, salePrice: 249, brand: "HomeStyle" },
    { title: "Decorative Throw Pillows Set", price: 49, salePrice: null, brand: "ComfortHome" },
    { title: "LED Floor Lamp", price: 89, salePrice: 69, brand: "LightUp" },
    { title: "Wall Art Canvas Set", price: 79, salePrice: 59, brand: "ArtDecor" },
    { title: "Kitchen Storage Organizer", price: 39, salePrice: null, brand: "OrganizePro" },
  ],
  "Sports & Outdoors": [
    { title: "Professional Yoga Mat", price: 45, salePrice: 35, brand: "FitLife" },
    { title: "Hiking Backpack 40L", price: 129, salePrice: 99, brand: "AdventureGear" },
    { title: "Resistance Bands Set", price: 29, salePrice: null, brand: "FitPro" },
    { title: "Waterproof Sports Watch", price: 89, salePrice: 69, brand: "SportTime" },
    { title: "Camping Tent 4-Person", price: 199, salePrice: 159, brand: "OutdoorLife" },
  ],
  "Beauty & Personal Care": [
    { title: "Vitamin C Serum", price: 29, salePrice: 24, brand: "GlowSkin" },
    { title: "Hydrating Face Mask Set", price: 39, salePrice: null, brand: "BeautyCare" },
    { title: "Natural Shampoo & Conditioner", price: 24, salePrice: 19, brand: "PureHair" },
    { title: "Anti-Aging Cream", price: 49, salePrice: 39, brand: "YouthSkin" },
    { title: "Makeup Brush Set", price: 35, salePrice: null, brand: "BeautyTools" },
  ],
};

// Review messages
const reviewMessages = [
  "Excellent product! Highly recommend.",
  "Great quality and fast shipping.",
  "Exactly as described. Very satisfied!",
  "Good value for money. Will buy again.",
  "Amazing product! Exceeded my expectations.",
  "Good quality but could be better.",
  "Nice product, works as expected.",
  "Love it! Perfect for my needs.",
  "Decent product for the price.",
  "Very happy with this purchase!",
];

async function seedVendors() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const createdVendors = [];

    for (const vendorData of vendors) {
      console.log(`\n📦 Creating vendor: ${vendorData.storeName}...`);

      // Check if user already exists
      let user = await User.findOne({ email: vendorData.email });
      if (!user) {
        // Create user
        const hashedPassword = await bcrypt.hash(vendorData.password, 12);
        user = await User.create({
          userName: vendorData.userName,
          email: vendorData.email,
          password: hashedPassword,
          role: "user", // Regular user role, not admin
        });
        console.log(`   ✅ Created user: ${vendorData.email}`);
      } else {
        console.log(`   ℹ️  User already exists: ${vendorData.email}`);
      }

      // Check if seller already exists
      let seller = await Seller.findOne({ userId: user._id });
      if (!seller) {
        // Create seller
        seller = await Seller.create({
          userId: user._id,
          storeName: vendorData.storeName,
          phone: vendorData.phone,
          businessType: vendorData.businessType,
          storeCategory: vendorData.storeCategory,
          description: vendorData.description,
          profilePic: vendorData.profilePic,
          backgroundImage: vendorData.backgroundImage,
          status: "approved", // Auto-approve for testing
        });
        console.log(`   ✅ Created seller profile`);
      } else {
        // Update existing seller with images
        seller.profilePic = vendorData.profilePic;
        seller.backgroundImage = vendorData.backgroundImage;
        seller.status = "approved";
        await seller.save();
        console.log(`   ℹ️  Updated existing seller profile`);
      }

      // Create products for this vendor
      const products = productTemplates[vendorData.storeCategory] || [];
      const createdProducts = [];

      for (const productTemplate of products) {
        const product = await Product.create({
          image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
          title: productTemplate.title,
          description: `High-quality ${productTemplate.title.toLowerCase()} from ${vendorData.storeName}. Perfect for your needs.`,
          category: vendorData.storeCategory.toLowerCase().replace(/\s+/g, ""),
          brand: productTemplate.brand,
          price: productTemplate.price,
          salePrice: productTemplate.salePrice,
          totalStock: Math.floor(Math.random() * 50) + 10,
          averageReview: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0 rating
          sellerId: seller._id,
        });
        createdProducts.push(product);
      }

      console.log(`   ✅ Created ${createdProducts.length} products`);

      // Create some reviews for the products
      const reviewUsers = await User.find({ role: "user" }).limit(5);
      let reviewCount = 0;

      for (const product of createdProducts) {
        // Create 2-4 reviews per product
        const numReviews = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numReviews && i < reviewUsers.length; i++) {
          const reviewUser = reviewUsers[i];
          const reviewValue = Math.floor(Math.random() * 2) + 4; // 4-5 stars
          const reviewMessage = reviewMessages[Math.floor(Math.random() * reviewMessages.length)];

          await Review.create({
            productId: product._id.toString(),
            userId: reviewUser._id.toString(),
            userName: reviewUser.userName,
            reviewMessage: reviewMessage,
            reviewValue: reviewValue,
          });
          reviewCount++;
        }
      }

      console.log(`   ✅ Created ${reviewCount} reviews`);

      createdVendors.push({
        sellerId: seller._id.toString(),
        storeName: seller.storeName,
        email: vendorData.email,
        password: vendorData.password,
      });
    }

    console.log("\n✅ Vendor seeding completed!");
    console.log("\n📋 Created Vendors:");
    console.log("=".repeat(60));
    createdVendors.forEach((vendor, index) => {
      console.log(`\n${index + 1}. ${vendor.storeName}`);
      console.log(`   Seller ID: ${vendor.sellerId}`);
      console.log(`   Email: ${vendor.email}`);
      console.log(`   Password: ${vendor.password}`);
      console.log(`   Profile URL: http://localhost:5173/shop/vendor/${vendor.sellerId}`);
    });
    console.log("\n" + "=".repeat(60));
    console.log("\n💡 You can now test the vendor profile feature!");
    console.log("   Visit any of the profile URLs above to see the vendor pages.");

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error seeding vendors:", error);
    process.exit(1);
  }
}

// Run the script
seedVendors();

