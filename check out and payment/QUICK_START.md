# Quick Start Guide - MongoDB Atlas Setup

## 🚀 Quick Steps (5-10 minutes)

### Step 1: Create Your Cluster
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. After logging in, click **"Build a Database"**
3. Select **"M0 FREE"** (Free tier)
4. Choose a cloud provider and region (pick closest to you)
5. Click **"Create"** (takes 3-5 minutes)

### Step 2: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** method
4. Enter username (e.g., `ecommerce-user`)
5. Click **"Autogenerate Secure Password"** ⚠️ **SAVE THIS PASSWORD!**
6. Select **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Allow Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (enter `0.0.0.0/0`)
   - Or click **"Add Current IP Address"** for more security
4. Click **"Confirm"**

### Step 4: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** driver
5. Copy the connection string

### Step 5: Update Your Connection String

**Option A: Direct Update (Easiest)**
1. Open `server/server.js`
2. Find line 26 with the connection string
3. Replace it with your Atlas connection string, but **ADD the database name**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
   ```
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password (URL encode special chars)
   - Keep `/ecommerceDBproject` in the string (this is your database name)

**Option B: Use .env file (Recommended)**
1. Create a file named `.env` in the `server` folder
2. Add this line:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with your actual credentials

### Step 6: Test Your Connection

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **You should see:**
   ```
   ✅ MongoDB connected successfully
   Server is now running on port 5000
   ```

3. **If you see an error**, check:
   - Username and password are correct
   - Password is URL encoded (special characters like `@` become `%40`)
   - Database name `/ecommerceDBproject` is in the connection string
   - Network access allows your IP (or `0.0.0.0/0`)

### Step 7: Test Registration

1. Start the client:
   ```bash
   cd client
   npm run dev
   ```

2. Go to: http://localhost:5173/auth/register
3. Fill out the form and register
4. You should see a success message!

## 🔒 Password URL Encoding

If your password has special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`

Or use an online URL encoder: https://www.urlencoder.org/

## ❓ Troubleshooting

**Error: "bad auth"**
- Check username and password are correct
- Make sure password is URL encoded

**Error: "connection timeout"**
- Check Network Access - add your IP or `0.0.0.0/0`

**Error: "Database name not specified"**
- Make sure `/ecommerceDBproject` is in your connection string before the `?`

## ✅ Success Indicators

- Server console shows: "✅ MongoDB connected successfully"
- You can register a new user
- You can login with registered credentials

