import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import {
  calculateDiscountForAmount,
  saveCurrentSessionCoupon,
  clearCurrentSessionCoupon,
  validateCoupon,
  getAvailableCoupons,
} from "@/lib/coupon-utils";
import "@/styles/cart.css";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = cartItems?.items || [];
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [couponError, setCouponError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const increaseQty = async (item) => {
    if (user?.id && item.productId) {
      await dispatch(updateCartQuantity({
        userId: user.id,
        productId: typeof item.productId === 'object' ? item.productId._id : item.productId,
        quantity: item.quantity + 1
      }));
      dispatch(fetchCartItems(user.id));
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity > 1 && user?.id && item.productId) {
      await dispatch(updateCartQuantity({
        userId: user.id,
        productId: typeof item.productId === 'object' ? item.productId._id : item.productId,
        quantity: item.quantity - 1
      }));
      dispatch(fetchCartItems(user.id));
    }
  };

  const removeItem = async (item) => {
    if (user?.id && item.productId) {
      await dispatch(deleteCartItem({
        userId: user.id,
        productId: typeof item.productId === 'object' ? item.productId._id : item.productId
      }));
      dispatch(fetchCartItems(user.id));
    }
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.salePrice && item.salePrice > 0 ? item.salePrice : (item.price || 0);
    return acc + price * (item.quantity || 0);
  }, 0);

  // Generate available discount coupon for current cart
  const availableDiscount = calculateDiscountForAmount(subtotal);

  // Save session coupon when cart qualifies for discount
  useEffect(() => {
    if (availableDiscount.percentage > 0 && cartItems?._id) {
      saveCurrentSessionCoupon(cartItems._id, availableDiscount);
    } else if (availableDiscount.percentage === 0 && cartItems?._id) {
      clearCurrentSessionCoupon(cartItems._id);
    }
  }, [subtotal, cartItems?._id, availableDiscount]);

  // Set coupon code in input field if discount is available and not already applied
  useEffect(() => {
    if (availableDiscount.percentage > 0 && !appliedDiscount && !couponCode) {
      setCouponCode(availableDiscount.code);
    } else if (availableDiscount.percentage === 0 && !appliedDiscount) {
      // Check for available coupons from completed purchases
      const savedCoupons = user?.id ? getAvailableCoupons(user.id) : [];
      if (savedCoupons.length > 0) {
        // Show the most recent coupon
        const recentCoupon = savedCoupons[savedCoupons.length - 1];
        setCouponCode(recentCoupon.code);
      }
    }
  }, [subtotal, appliedDiscount, couponCode, availableDiscount, user?.id]);

  const handleApplyCoupon = () => {
    setCouponError(null);
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!user?.id) {
      setCouponError("Please login to use coupons");
      return;
    }

    // Validate coupon using the utility
    const validation = validateCoupon(
      couponCode,
      user.id,
      cartItems?._id,
      subtotal
    );

    if (validation.valid) {
      setAppliedDiscount(validation.couponData);
      setCouponError(null);
    } else {
      setCouponError(validation.reason);
      setAppliedDiscount(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponError(null);
    // Reset to current session coupon or available coupon
    if (availableDiscount.percentage > 0) {
      setCouponCode(availableDiscount.code);
    } else {
      const savedCoupons = user?.id ? getAvailableCoupons(user.id) : [];
      if (savedCoupons.length > 0) {
        setCouponCode(savedCoupons[savedCoupons.length - 1].code);
      } else {
        setCouponCode("");
      }
    }
  };

  // Clear error when coupon code changes
  useEffect(() => {
    if (couponCode && couponError) {
      setCouponError(null);
    }
  }, [couponCode]);

  const taxes = items.length > 0 ? 10 : 0;
  const total = subtotal - (appliedDiscount?.amount || 0) + taxes;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title">Cart</h2>
        <p className="text-center text-gray-600">Your cart is empty</p>
        <button
          onClick={() => navigate("/shop/listing")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Cart</h2>
      <div className="cart-layout">
        {/* LEFT SIDE - Items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <span>Delete</span>
            <span>Product Name</span>
            <span>Price</span>
            <span>Quantity</span>
          </div>

          {items.map((item) => {
            const price = item.salePrice && item.salePrice > 0 ? item.salePrice : (item.price || 0);
            return (
              <div className="cart-row" key={item.productId || item._id || Math.random()}>
                <button className="remove-btn" onClick={() => removeItem(item)}>
                  ✕ Remove
                </button>
                <div className="product-info">
                  <img 
                    src={item.image || "/images/product1.jpg"} 
                    alt={item.title || "Product"} 
                  />
                  <div>
                    <h4 style={{ color: "#1b3b6f" }}>{item.title || "Product"}</h4>
                    <div className="product-meta">
                      <span className="rating">
                        <i className="fa-solid fa-star"></i> 4.5
                      </span>
                      <span>12 Reviews</span>
                    </div>
                  </div>
                </div>
                <span className="price">${price.toFixed(2)}</span>
                <div className="qty-box">
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE - Totals */}
        <div className="cart-summary">
          <h3>Cart Totals</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div className="summary-line" style={{ color: "#16a34a", fontWeight: "600" }}>
              <span>Discount ({appliedDiscount.percentage}%)</span>
              <span>-${appliedDiscount.amount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-line">
            <span>Estimated Delivery</span>
            <span>Free</span>
          </div>
          <div className="summary-line">
            <span>Estimated Taxes</span>
            <span>USD {taxes.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="coupon">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
            />
            {appliedDiscount ? (
              <button onClick={handleRemoveCoupon} style={{ background: "#dc2626" }}>
                Remove Coupon
              </button>
            ) : (
              <button onClick={handleApplyCoupon}>Apply Coupon</button>
            )}
          </div>
          {/* Show success message or error message */}
          {appliedDiscount ? (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              background: "#f0fdf4", 
              border: "1px solid #16a34a", 
              borderRadius: "4px",
              fontSize: "12px",
              color: "#16a34a"
            }}>
              ✓ Coupon applied! You saved {appliedDiscount.percentage}% on your order
            </div>
          ) : couponError ? (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              background: "#fef2f2", 
              border: "1px solid #dc2626", 
              borderRadius: "4px",
              fontSize: "12px",
              color: "#dc2626"
            }}>
              ⚠ {couponError}
            </div>
          ) : availableDiscount.percentage > 0 ? (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              background: "#f0fdf4", 
              border: "1px solid #16a34a", 
              borderRadius: "4px",
              fontSize: "12px",
              color: "#16a34a"
            }}>
              💰 You're eligible for a {availableDiscount.percentage}% discount! Use coupon code: <strong>{availableDiscount.code}</strong>
            </div>
          ) : null}
          <button
            onClick={() => navigate("/shop/payment")}
            className="w-full mt-4 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #3b5bdb, #1b3b6f)" }}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* BOTTOM SERVICES */}
      <div className="services">
        <div className="service-box">
          <i className="fa-solid fa-truck-fast"></i>
          <div>
            Free Shipping<br />
            <small>Free shipping all over the US</small>
          </div>
        </div>

        <div className="service-box">
          <i className="fa-solid fa-thumbs-up"></i>
          <div>
            100% Satisfaction<br />
            <small>Free shipping all over the US</small>
          </div>
        </div>

        <div className="service-box">
          <i className="fa-solid fa-credit-card"></i>
          <div>
            Secure Payments<br />
            <small>Safe checkout guaranteed</small>
          </div>
        </div>

        <div className="service-box">
          <i className="fa-solid fa-headset"></i>
          <div>
            24/7 Support<br />
            <small>We're here to help</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

