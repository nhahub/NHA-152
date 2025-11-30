import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import "@/styles/cart.css";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = cartItems?.items || [];

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
  
  const taxes = items.length > 0 ? 10 : 0;
  const total = subtotal + taxes;

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
            <input type="text" placeholder="Coupon Code" />
            <button>Apply Coupon</button>
          </div>
          <button
            onClick={() => navigate("/shop/checkout/payment")}
            className="w-full mt-4 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #3b5bdb, #1b3b6f)" }}
          >
            Proceed to Checkout
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

