// Coupon management utilities

/**
 * Get all available coupons for a user (from completed purchases)
 */
export const getAvailableCoupons = (userId) => {
  try {
    const key = `user_coupons_${userId}`;
    const coupons = localStorage.getItem(key);
    return coupons ? JSON.parse(coupons) : [];
  } catch (error) {
    console.error("Error getting available coupons:", error);
    return [];
  }
};

/**
 * Save a coupon from a completed purchase
 */
export const saveCouponFromPurchase = (userId, couponData) => {
  try {
    const key = `user_coupons_${userId}`;
    const existingCoupons = getAvailableCoupons(userId);
    
    // Check if coupon already exists
    const exists = existingCoupons.some(
      (c) => c.code === couponData.code && c.orderId === couponData.orderId
    );
    
    if (!exists) {
      const newCoupon = {
        ...couponData,
        orderId: couponData.orderId,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      existingCoupons.push(newCoupon);
      localStorage.setItem(key, JSON.stringify(existingCoupons));
    }
  } catch (error) {
    console.error("Error saving coupon:", error);
  }
};

/**
 * Get current session coupon (for the current cart)
 */
export const getCurrentSessionCoupon = (cartId) => {
  try {
    const key = `session_coupon_${cartId}`;
    const coupon = localStorage.getItem(key);
    return coupon ? JSON.parse(coupon) : null;
  } catch (error) {
    console.error("Error getting session coupon:", error);
    return null;
  }
};

/**
 * Save current session coupon (generated from current cart)
 */
export const saveCurrentSessionCoupon = (cartId, couponData) => {
  try {
    const key = `session_coupon_${cartId}`;
    const coupon = {
      ...couponData,
      cartId,
      isSessionCoupon: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(coupon));
  } catch (error) {
    console.error("Error saving session coupon:", error);
  }
};

/**
 * Clear current session coupon (when cart changes or is cleared)
 */
export const clearCurrentSessionCoupon = (cartId) => {
  try {
    const key = `session_coupon_${cartId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing session coupon:", error);
  }
};

/**
 * Validate if a coupon can be used
 * Returns { valid: boolean, reason: string, couponData: object, errorType: string }
 * errorType can be: 'invalid_format', 'not_found', 'already_used', 'not_eligible', 'session_mismatch'
 */
export const validateCoupon = (couponCode, userId, cartId, currentSubtotal) => {
  const code = couponCode.trim().toUpperCase();
  
  // Check if it's a valid format
  const couponMatch = code.match(/^SAVE(\d+)OFF$/);
  if (!couponMatch) {
    return {
      valid: false,
      reason: "Invalid coupon code format",
      errorType: "invalid_format",
      couponData: null,
    };
  }

  const couponPercentage = parseInt(couponMatch[1]);
  if (couponPercentage < 5 || couponPercentage > 15) {
    return {
      valid: false,
      reason: "Invalid discount percentage",
      errorType: "invalid_format",
      couponData: null,
    };
  }

  // Check if it's the current session coupon
  const sessionCoupon = getCurrentSessionCoupon(cartId);
  if (sessionCoupon && sessionCoupon.code === code) {
    // Validate it matches current cart total
    const expectedDiscount = calculateDiscountForAmount(currentSubtotal);
    if (expectedDiscount.percentage === couponPercentage) {
      return {
        valid: true,
        reason: "Valid session coupon",
        errorType: null,
        couponData: {
          ...sessionCoupon,
          amount: Math.floor((currentSubtotal * couponPercentage) / 100),
        },
      };
    } else {
      return {
        valid: false,
        reason: "This coupon is not valid for your current order total",
        errorType: "session_mismatch",
        couponData: null,
      };
    }
  }

  // Check if it's from a completed purchase
  const availableCoupons = getAvailableCoupons(userId);
  const savedCoupon = availableCoupons.find(
    (c) => c.code === code
  );

  if (savedCoupon) {
    // Check if coupon has been used
    if (!savedCoupon.isActive || savedCoupon.usedAt) {
      return {
        valid: false,
        reason: "This coupon has already been used",
        errorType: "already_used",
        couponData: null,
      };
    }

    // Coupon from completed purchase - can be used on any order
    return {
      valid: true,
      reason: "Valid coupon from completed purchase",
      errorType: null,
      couponData: {
        ...savedCoupon,
        amount: Math.floor((currentSubtotal * couponPercentage) / 100),
      },
    };
  }

  return {
    valid: false,
    reason: "Coupon not found or not available. Complete a purchase to activate this coupon.",
    errorType: "not_found",
    couponData: null,
  };
};

/**
 * Calculate discount for a given amount
 */
export const calculateDiscountForAmount = (subtotalAmount) => {
  if (subtotalAmount < 200) {
    return { percentage: 0, amount: 0, code: "" };
  }

  let discountPercentage = 5;
  
  if (subtotalAmount >= 2000) {
    discountPercentage = 15;
  } else {
    const amountOver200 = subtotalAmount - 200;
    const additionalPercentage = Math.floor((amountOver200 / 1800) * 10);
    discountPercentage = 5 + Math.min(10, additionalPercentage);
  }

  discountPercentage = Math.max(5, Math.min(15, discountPercentage));
  const discountAmount = Math.floor((subtotalAmount * discountPercentage) / 100);
  const couponCode = `SAVE${discountPercentage}OFF`;

  return {
    percentage: discountPercentage,
    amount: discountAmount,
    code: couponCode,
  };
};

/**
 * Mark a coupon as used (one-time use only)
 */
export const markCouponAsUsed = (userId, couponCode, orderId) => {
  try {
    const key = `user_coupons_${userId}`;
    const coupons = getAvailableCoupons(userId);
    const updatedCoupons = coupons.map((c) => {
      if (c.code === couponCode && c.isActive && !c.usedAt) {
        return {
          ...c,
          isActive: false,
          usedAt: new Date().toISOString(),
          usedInOrderId: orderId,
        };
      }
      return c;
    });
    localStorage.setItem(key, JSON.stringify(updatedCoupons));
  } catch (error) {
    console.error("Error marking coupon as used:", error);
  }
};

