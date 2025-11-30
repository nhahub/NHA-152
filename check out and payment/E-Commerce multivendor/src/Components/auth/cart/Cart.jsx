import React, { useState } from "react";
import "../../../styles/cart.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Cart = () => {
  const initialItems = [
    {
      id: 1,
      name: "Product 1",
      price: 50,
      qty: 2,
      image: "/images/product1.jpg",
      rating: 4.5,
      reviews: 12,
      tags: ["New", "Hot"]
    },
    {
      id: 2,
      name: "Product 2",
      price: 30,
      qty: 1,
      image: "/images/product2.jpg",
      rating: 4,
      reviews: 5,
      tags: ["Sale"]
    }
  ];

  const [items, setItems] = useState(initialItems);

  // زيادة الكمية
  const increaseQty = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // نقص الكمية
  const decreaseQty = (id) => {
    setItems(
      items.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  // حذف منتج
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxes = items.length > 0 ? 10 : 0;
  const total = subtotal + taxes;

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

          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                ✕ Remove
              </button>
              <div className="product-info">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4 style={{ color: "#1b3b6f" }}>{item.name}</h4>
                  <div className="product-meta">
                    <span className="rating">
                      <i className="fa-solid fa-star"></i> {item.rating}
                    </span>
                    <span>{item.reviews} Reviews</span>
                    <div className="tags">
                      {item.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <span className="price">${item.price.toFixed(2)}</span>
              <div className="qty-box">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>
          ))}
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

export default Cart;
