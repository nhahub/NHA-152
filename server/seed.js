require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Address = require("./models/Address");
const Review = require("./models/Review");
const Feature = require("./models/Feature");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nadimhassan99921_db_user:kE1ewe4AGuMcO7nn@cluster0.zey0gnm.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority";

// Sample data arrays
const categories = ["men", "women", "kids", "footwear", "accessories"];
const brands = ["Nike", "Adidas", "Puma", "Levi's", "Zara", "H&M", "Gap", "Uniqlo"];
const productTitles = {
  men: [
    "Classic Men's T-Shirt", "Slim Fit Jeans", "Men's Polo Shirt", 
    "Denim Jacket", "Chino Pants", "Hoodie Sweatshirt", "Formal Shirt",
    "Cargo Shorts", "Leather Jacket", "Wool Blazer"
  ],
  women: [
    "Floral Summer Dress", "Women's Skinny Jeans", "Silk Blouse",
    "Denim Skirt", "Knit Sweater", "Trench Coat", "Casual Blazer",
    "Maxi Dress", "High-Waisted Pants", "Off-Shoulder Top"
  ],
  kids: [
    "Kids' Denim Overalls", "Children's T-Shirt", "Kids' Sneakers",
    "Rainbow Sweater", "Cargo Pants", "Hooded Jacket", "Dress Set",
    "Activewear Set", "School Uniform", "Play Clothes"
  ],
  footwear: [
    "Running Sneakers", "Casual Boots", "Athletic Shoes",
    "Formal Leather Shoes", "Sandals", "High-Top Sneakers",
    "Hiking Boots", "Dress Shoes", "Sports Sandals", "Canvas Shoes"
  ],
  accessories: [
    "Leather Belt", "Designer Sunglasses", "Leather Wallet",
    "Backpack", "Watch", "Baseball Cap", "Scarf", "Tie Set",
    "Backpack", "Phone Case"
  ]
};

const productDescriptions = [
  "High-quality material with excellent craftsmanship. Perfect for everyday wear.",
  "Comfortable fit with modern design. Made from premium materials.",
  "Stylish and versatile piece that pairs well with any outfit.",
  "Durable construction ensures long-lasting quality and comfort.",
  "Trendy design that never goes out of style. Great value for money.",
  "Soft and breathable fabric for maximum comfort throughout the day.",
  "Classic design with contemporary touches. Perfect for any occasion.",
  "Premium quality materials sourced from the finest suppliers.",
  "Eco-friendly production with sustainable materials.",
  "Attention to detail in every stitch. Luxury meets affordability."
];

const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"];
const streets = ["Main St", "Oak Ave", "Elm St", "Park Ave", "Maple Dr", "Cedar Ln", "Pine Rd", "Birch Way"];

// Generate random product image URL (using placeholder service)
const getProductImage = (category) => {
  const imageId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/400/400?random=${imageId}`;
};

// Hash password function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - uncomment to reset database)
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Address.deleteMany({});
    await Review.deleteMany({});
    await Feature.deleteMany({});
    console.log("✅ Database cleared");

    // Create Users
    console.log("👥 Creating users...");
    const hashedPassword = await hashPassword("password123"); // Default password for all test users
    
    const users = [];
    // Admin user
    const adminUser = await User.create({
      userName: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    users.push(adminUser);
    console.log("✅ Created admin user: admin@example.com / password123");

    // Regular users
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        userName: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        role: "user"
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users (1 admin, 10 regular)`);

    // Create Products
    console.log("🛍️  Creating products...");
    const products = [];
    
    for (const category of categories) {
      const titles = productTitles[category] || productTitles.men;
      const productsInCategory = Math.floor(Math.random() * 8) + 5; // 5-12 products per category
      
      for (let i = 0; i < productsInCategory; i++) {
        const title = titles[i % titles.length] + ` ${i + 1}`;
        const basePrice = Math.floor(Math.random() * 200) + 20; // $20-$220
        const hasSale = Math.random() > 0.6; // 40% chance of sale
        const salePrice = hasSale ? Math.floor(basePrice * 0.7) : null; // 30% off
        
        const product = await Product.create({
          image: getProductImage(category),
          title: title,
          description: productDescriptions[Math.floor(Math.random() * productDescriptions.length)],
          category: category,
          brand: brands[Math.floor(Math.random() * brands.length)],
          price: basePrice,
          salePrice: salePrice,
          totalStock: Math.floor(Math.random() * 100) + 10, // 10-110 in stock
          averageReview: parseFloat((Math.random() * 2 + 3).toFixed(1)) // 3.0-5.0 rating
        });
        products.push(product);
      }
    }
    console.log(`✅ Created ${products.length} products across ${categories.length} categories`);

    // Create Carts for some users (skip admin)
    console.log("🛒 Creating carts...");
    const regularUsers = users.filter(u => u.role !== "admin");
    let cartCount = 0;
    
    for (let i = 0; i < Math.min(5, regularUsers.length); i++) {
      const user = regularUsers[i];
      const numItems = Math.floor(Math.random() * 5) + 1; // 1-5 items
      const selectedProducts = [];
      
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        if (!selectedProducts.find(p => p.productId.toString() === randomProduct._id.toString())) {
          selectedProducts.push({
            productId: randomProduct._id,
            quantity: Math.floor(Math.random() * 3) + 1 // 1-3 quantity
          });
        }
      }
      
      if (selectedProducts.length > 0) {
        await Cart.create({
          userId: user._id,
          items: selectedProducts
        });
        cartCount++;
      }
    }
    console.log(`✅ Created ${cartCount} carts`);

    // Create Addresses for users
    console.log("📍 Creating addresses...");
    let addressCount = 0;
    for (let i = 0; i < Math.min(7, regularUsers.length); i++) {
      const user = regularUsers[i];
      await Address.create({
        userId: user._id.toString(),
        address: `${Math.floor(Math.random() * 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        pincode: String(Math.floor(Math.random() * 90000) + 10000), // 5-digit zip
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`, // 10-digit phone
        notes: i % 2 === 0 ? "Please leave at door" : "Ring doorbell"
      });
      addressCount++;
    }
    console.log(`✅ Created ${addressCount} addresses`);

    // Create Orders
    console.log("📦 Creating orders...");
    let orderCount = 0;
    const orderStatuses = ["pending", "processing", "shipped", "delivered"];
    const paymentMethods = ["paypal", "credit_card", "cash_on_delivery"];
    const paymentStatuses = ["pending", "completed", "failed"];
    
    for (let i = 0; i < Math.min(8, regularUsers.length); i++) {
      const user = regularUsers[i];
      const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
      const orderItems = [];
      let totalAmount = 0;
      
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = randomProduct.salePrice || randomProduct.price;
        totalAmount += price * quantity;
        
        orderItems.push({
          productId: randomProduct._id.toString(),
          title: randomProduct.title,
          image: randomProduct.image,
          price: price.toString(),
          quantity: quantity
        });
      }
      
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentStatus = paymentMethod === "cash_on_delivery" && orderStatus === "pending" 
        ? "pending" 
        : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      await Order.create({
        userId: user._id.toString(),
        cartId: "",
        cartItems: orderItems,
        addressInfo: {
          addressId: "",
          address: `${Math.floor(Math.random() * 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          pincode: String(Math.floor(Math.random() * 90000) + 10000),
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          notes: ""
        },
        orderStatus: orderStatus,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        orderUpdateDate: new Date(),
        paymentId: paymentStatus === "completed" ? `pay_${Math.random().toString(36).substr(2, 9)}` : "",
        payerId: paymentStatus === "completed" ? `payer_${Math.random().toString(36).substr(2, 9)}` : ""
      });
      orderCount++;
    }
    console.log(`✅ Created ${orderCount} orders`);

    // Create Reviews
    console.log("⭐ Creating reviews...");
    let reviewCount = 0;
    const reviewMessages = [
      "Great product! Highly recommend.",
      "Good quality for the price.",
      "Exceeded my expectations.",
      "Fast shipping and good packaging.",
      "Love it! Will buy again.",
      "Decent product but could be better.",
      "Amazing value for money!",
      "Perfect fit and great quality.",
      "Not bad, but expected more.",
      "Excellent product, very satisfied!"
    ];
    
    for (let i = 0; i < 30; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      
      await Review.create({
        productId: randomProduct._id.toString(),
        userId: randomUser._id.toString(),
        userName: randomUser.userName,
        reviewMessage: reviewMessages[Math.floor(Math.random() * reviewMessages.length)],
        reviewValue: Math.floor(Math.random() * 2) + 4 // 4-5 stars
      });
      reviewCount++;
    }
    console.log(`✅ Created ${reviewCount} reviews`);

    // Create Features
    console.log("✨ Creating features...");
    const featureImages = [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800"
    ];
    
    for (const imageUrl of featureImages) {
      await Feature.create({
        image: imageUrl
      });
    }
    console.log(`✅ Created ${featureImages.length} features`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${users.length} (1 admin, ${users.length - 1} regular)`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Carts: ${cartCount}`);
    console.log(`   - Addresses: ${addressCount}`);
    console.log(`   - Orders: ${orderCount}`);
    console.log(`   - Reviews: ${reviewCount}`);
    console.log(`   - Features: ${featureImages.length}`);
    console.log("\n🔑 Test Credentials:");
    console.log("   Admin: admin@example.com / password123");
    console.log("   User: user1@example.com / password123");
    console.log("   (All users use password: password123)\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

