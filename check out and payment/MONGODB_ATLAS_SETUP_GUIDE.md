# MongoDB Atlas Setup Guide

## Step 1: Create a Cluster on MongoDB Atlas

1. **Log in** to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Click **"Build a Database"** or **"Create"** button
3. Choose **"M0 FREE"** tier (Free forever)
4. Select your preferred **Cloud Provider** and **Region** (choose closest to you)
5. Click **"Create"** (cluster creation takes 3-5 minutes)

## Step 2: Create a Database User

1. While cluster is building, go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password" authentication method
4. Enter a username (e.g., `ecommerce-user`)
5. Click **"Autogenerate Secure Password"** or create your own (SAVE THIS PASSWORD!)
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

## Step 3: Configure Network Access (Whitelist IP)

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"** OR click **"Allow Access from Anywhere"** and enter `0.0.0.0/0` (less secure, but good for testing)
4. Click **"Confirm"**

## Step 4: Get Your Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Update Your Connection String

Replace `<username>` and `<password>` in the connection string:
- `<username>` → the database user you created (e.g., `ecommerce-user`)
- `<password>` → the password you set for that user (URL encode special characters like `@` becomes `%40`)

**Example:**
```
mongodb+srv://ecommerce-user:MyPassword123@cluster0.xxxxx.mongodb.net/ecommerceDBproject?retryWrites=true&w=majority
```

**Important:** Add your database name (`ecommerceDBproject`) before the `?` in the connection string!

