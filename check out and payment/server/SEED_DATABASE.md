# Database Seeding Guide

This script populates your MongoDB database with sample data for testing the e-commerce website.

## How to Run

```bash
# From the server directory
cd server
npm run seed
```

Or directly:
```bash
node seed.js
```

## What Gets Created

### Users (11 total)
- **1 Admin User**
  - Email: `admin@example.com`
  - Password: `password123`
  - Role: `admin`
  
- **10 Regular Users**
  - Emails: `user1@example.com` through `user10@example.com`
  - Password: `password123` (for all)
  - Role: `user`

### Products (~48 products)
- Distributed across 5 categories:
  - Men's clothing
  - Women's clothing
  - Kids' clothing
  - Footwear
  - Accessories
- Each product includes:
  - Random images (placeholder)
  - Titles and descriptions
  - Prices ($20-$220)
  - Some products have sale prices (30% off)
  - Stock levels (10-110 units)
  - Average review ratings (3.0-5.0)
  - Random brands (Nike, Adidas, Puma, etc.)

### Carts (5 carts)
- Assigned to random users
- Each cart contains 1-5 products
- Quantities vary (1-3 per item)

### Addresses (7 addresses)
- Associated with different users
- Random US addresses
- Phone numbers
- Some include delivery notes

### Orders (8 orders)
- Various statuses: pending, processing, shipped, delivered
- Different payment methods: PayPal, credit card, cash on delivery
- Payment statuses: pending, completed, failed
- Random order dates (within last 30 days)
- Total amounts calculated from product prices

### Reviews (30 reviews)
- Random products and users
- 4-5 star ratings
- Review messages

### Features (4 features)
- Hero banner images for the homepage

## ⚠️ Important Notes

1. **The script will DELETE all existing data** before seeding. Make sure you're okay with this!
2. All users have the same password: `password123`
3. Product images are placeholders from a random image service
4. The script uses your MongoDB connection string from `.env` or the default in `server.js`

## Customizing the Seed Data

Edit `server/seed.js` to:
- Change the number of users, products, etc.
- Modify price ranges
- Add different categories
- Change the default password
- Adjust quantities and distributions

## Testing the Website

After seeding, you can:
1. Login as admin: `admin@example.com` / `password123`
2. Login as regular user: `user1@example.com` / `password123`
3. Browse products across all categories
4. Add items to cart
5. View orders and reviews
6. Test the admin dashboard with the admin account

Enjoy testing! 🎉

