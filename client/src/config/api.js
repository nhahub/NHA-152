// API Configuration
// This file centralizes all API endpoints and base URL configuration

// Get API base URL from environment variable or use default
// In development, use localhost; in production, use Render URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? "http://localhost:5000" : "https://multi-vendor-e-commerce-webapp-1.onrender.com");

// Create axios instance with default configuration
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (optional - for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - for handling errors globally)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CHECK_AUTH: "/api/auth/check-auth",
    UPLOAD_PROFILE_PICTURE: "/api/auth/upload-profile-picture",
    UPDATE_PROFILE_PICTURE: (userId) => `/api/auth/update-profile-picture/${userId}`,
    UPDATE_ACCOUNT: (userId) => `/api/auth/update-account/${userId}`,
  },
  // Admin endpoints
  ADMIN: {
    PRODUCTS: {
      ADD: "/api/admin/products/add",
      GET: "/api/admin/products/get",
      EDIT: (id) => `/api/admin/products/edit/${id}`,
      DELETE: (id) => `/api/admin/products/delete/${id}`,
      UPLOAD_IMAGE: "/api/admin/products/upload-image",
    },
    ORDERS: {
      STATISTICS: "/api/admin/orders/statistics",
      GET: "/api/admin/orders/get",
      DETAILS: (id) => `/api/admin/orders/details/${id}`,
      UPDATE: (id) => `/api/admin/orders/update/${id}`,
    },
    VENDORS: {
      GET: "/api/admin/vendors/get",
      PENDING: "/api/admin/vendors/pending",
      DETAILS: (sellerId) => `/api/admin/vendors/${sellerId}`,
      APPROVE: (sellerId) => `/api/admin/vendors/approve/${sellerId}`,
      REJECT: (sellerId) => `/api/admin/vendors/reject/${sellerId}`,
      SUSPEND: (sellerId) => `/api/admin/vendors/suspend/${sellerId}`,
      DELETE: (sellerId) => `/api/admin/vendors/delete/${sellerId}`,
    },
  },
  // Vendor endpoints
  VENDOR: {
    PRODUCTS: {
      ADD: (sellerId) => `/api/vendor/products/add/${sellerId}`,
      GET: (sellerId) => `/api/vendor/products/get/${sellerId}`,
      EDIT: (sellerId, productId) => `/api/vendor/products/edit/${sellerId}/${productId}`,
      DELETE: (sellerId, productId) => `/api/vendor/products/delete/${sellerId}/${productId}`,
    },
    ORDERS: {
      GET: (sellerId) => `/api/vendor/orders/get/${sellerId}`,
      DETAILS: (sellerId, orderId) => `/api/vendor/orders/details/${sellerId}/${orderId}`,
      UPDATE: (sellerId, orderId) => `/api/vendor/orders/update/${sellerId}/${orderId}`,
    },
  },
  // Shop endpoints
  SHOP: {
    PRODUCTS: {
      GET: "/api/shop/products/get",
      GET_BY_ID: (id) => `/api/shop/products/get/${id}`,
      GET_OFFERS: "/api/shop/products/offers",
      GET_LATEST: "/api/shop/products/latest",
    },
    CART: {
      ADD: "/api/shop/cart/add",
      GET: (userId) => `/api/shop/cart/get/${userId}`,
      DELETE: (userId, productId) => `/api/shop/cart/${userId}/${productId}`,
      UPDATE: "/api/shop/cart/update-cart",
    },
    ADDRESS: {
      ADD: "/api/shop/address/add",
      GET: (userId) => `/api/shop/address/get/${userId}`,
      UPDATE: (userId, addressId) => `/api/shop/address/update/${userId}/${addressId}`,
      DELETE: (userId, addressId) => `/api/shop/address/delete/${userId}/${addressId}`,
    },
    ORDER: {
      CREATE: "/api/shop/order/create",
      CAPTURE: "/api/shop/order/capture",
      LIST: (userId) => `/api/shop/order/list/${userId}`,
      DETAILS: (id) => `/api/shop/order/details/${id}`,
    },
    SEARCH: (keyword) => `/api/shop/search/${keyword}`,
    REVIEW: {
      ADD: "/api/shop/review/add",
      GET: (id) => `/api/shop/review/${id}`,
      RECENT: "/api/shop/review/recent",
    },
    SELLER: "/api/seller",
    CONTACT: "/api/contact",
    VENDOR: {
      PROFILE: (sellerId) => `/api/vendor/profile/${sellerId}`,
      PRODUCTS: (sellerId) => `/api/vendor/products/${sellerId}`,
      REVIEWS: (sellerId) => `/api/vendor/reviews/${sellerId}`,
      UPDATE: (sellerId) => `/api/vendor/update/${sellerId}`,
      FEATURED: "/api/vendor/featured",
      CUSTOM_PRODUCT: (sellerId) => `/api/vendor/custom-product/${sellerId}`,
      CUSTOM_PRODUCT_REQUESTS: (sellerId) => `/api/vendor/custom-product-requests/${sellerId}`,
      ACCEPT_CUSTOM_REQUEST: (requestId) => `/api/vendor/custom-product-request/accept/${requestId}`,
      REJECT_CUSTOM_REQUEST: (requestId) => `/api/vendor/custom-product-request/reject/${requestId}`,
    },
    BLOG: {
      GET: "/api/blog/get",
      GET_BY_ID: (id) => `/api/blog/get/${id}`,
      CREATE: "/api/blog/create",
      UPDATE: (id) => `/api/blog/update/${id}`,
      DELETE: (id) => `/api/blog/delete/${id}`,
    },
    WISHLIST: {
      ADD: "/api/shop/wishlist/add",
      REMOVE: "/api/shop/wishlist/remove",
      GET: (userId) => `/api/shop/wishlist/get/${userId}`,
      CHECK: "/api/shop/wishlist/check",
    },
  },
  // Common endpoints
  COMMON: {
    FEATURE: {
      GET: "/api/common/feature/get",
      ADD: "/api/common/feature/add",
    },
  },
};

export { apiClient, API_BASE_URL };
export default apiClient;

