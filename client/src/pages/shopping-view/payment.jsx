import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FaPaypal, FaMoneyBillAlt } from "react-icons/fa";
import { CreditCard, ShoppingBag, MapPin, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  calculateDiscountForAmount,
  saveCurrentSessionCoupon,
  clearCurrentSessionCoupon,
  validateCoupon,
  getAvailableCoupons,
} from "@/lib/coupon-utils";

function PaymentPage() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const subtotalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Generate available discount coupon for current cart
  const availableDiscount = calculateDiscountForAmount(subtotalAmount);

  // Save session coupon when cart qualifies for discount
  useEffect(() => {
    if (availableDiscount.percentage > 0 && cartItems?._id) {
      saveCurrentSessionCoupon(cartItems._id, availableDiscount);
    } else if (availableDiscount.percentage === 0 && cartItems?._id) {
      clearCurrentSessionCoupon(cartItems._id);
    }
  }, [subtotalAmount, cartItems?._id, availableDiscount]);

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
  }, [subtotalAmount, appliedDiscount, couponCode, availableDiscount, user?.id]);

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
      subtotalAmount
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

  const totalCartAmount = subtotalAmount - (appliedDiscount?.amount || 0);

  function handleInitiatePayment() {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes || "",
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
      discount: appliedDiscount ? {
        percentage: appliedDiscount.percentage,
        amount: appliedDiscount.amount,
        code: appliedDiscount.code,
      } : null,
    };

    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        // Mark coupon as used after successful order creation
        if (appliedDiscount && user?.id) {
          import("@/lib/coupon-utils").then(({ markCouponAsUsed }) => {
            markCouponAsUsed(user.id, appliedDiscount.code, data?.payload?.orderId);
          });
        }
        if (paymentMethod === "paypal" && data?.payload?.approvalURL) {
          // Store coupon info for PayPal return flow
          if (availableDiscount.percentage > 0) {
            sessionStorage.setItem("pendingCoupon", JSON.stringify({
              ...availableDiscount,
              orderId: data?.payload?.orderId,
            }));
          }
          window.location.href = data.payload.approvalURL;
        } else {
          // COD order - save coupon and navigate to success page
          if (availableDiscount.percentage > 0 && user?.id) {
            import("@/lib/coupon-utils").then(({ saveCouponFromPurchase }) => {
              saveCouponFromPurchase(user.id, {
                ...availableDiscount,
                orderId: data?.payload?.orderId,
              });
            });
          }
          navigate("/shop/payment-success", {
            state: { 
              orderDetails: { ...orderData, _id: data?.payload?.orderId },
              generatedCoupon: availableDiscount.percentage > 0 ? availableDiscount : null,
            },
          });
        }
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Error creating order. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img 
          src={img} 
          className="h-full w-full object-cover object-center" 
          alt="Payment background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/80 via-[#2f3fbd]/70 to-[#3785D8]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
            <p className="text-white/90 text-lg">Review your order and select payment method</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Address Selection */}
            <div className="space-y-6">
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Delivery Address</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Select or add a delivery address
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                    hideHeader={true}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {cartItems?.items?.length || 0} item(s) in your cart
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scroll">
                    {cartItems && cartItems.items && cartItems.items.length > 0 ? (
                      cartItems.items.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-600 dark:text-slate-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Your cart is empty</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">${subtotalAmount.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                        <span className="font-medium">Discount ({appliedDiscount.percentage}%)</span>
                        <span className="font-semibold">-${appliedDiscount.amount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  {/* Coupon Section */}
                  {availableDiscount.percentage > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyCoupon();
                            }
                          }}
                          className="flex-1"
                        />
                        {appliedDiscount ? (
                          <Button
                            onClick={handleRemoveCoupon}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            onClick={handleApplyCoupon}
                            className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      {/* Show success message or error message */}
                      {appliedDiscount ? (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                          ✓ Coupon applied! You saved {appliedDiscount.percentage}% on your order
                        </p>
                      ) : couponError ? (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                          ⚠ {couponError}
                        </p>
                      ) : availableDiscount.percentage > 0 ? (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                          💰 You're eligible for a {availableDiscount.percentage}% discount! Use code: <strong>{availableDiscount.code}</strong>
                        </p>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method & Total */}
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Payment Method</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        Choose how you'd like to pay
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-[#3785D8] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "paypal"
                          ? "bg-[#3785D8]"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}>
                        <FaPaypal className={`text-xl ${
                          paymentMethod === "paypal" ? "text-white" : "text-slate-600 dark:text-slate-300"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">PayPal</p>
                          {paymentMethod === "paypal" && (
                            <CheckCircle2 className="w-5 h-5 text-[#3785D8]" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Pay securely with your PayPal account
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "bg-emerald-500"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}>
                        <FaMoneyBillAlt className={`text-xl ${
                          paymentMethod === "cod" ? "text-white" : "text-slate-600 dark:text-slate-300"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</p>
                          {paymentMethod === "cod" && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-2 mb-4">
                      {appliedDiscount && (
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                          <span className="text-sm font-medium">You saved ({appliedDiscount.percentage}% off)</span>
                          <span className="text-sm font-semibold">-${appliedDiscount.amount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-transparent bg-clip-text">
                          ${totalCartAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleInitiatePayment}
                      className="w-full h-12 text-base bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-lg font-semibold"
                      disabled={isPaymentStart}
                    >
                      {isPaymentStart ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing {paymentMethod === "paypal" ? "PayPal" : "Payment"}...
                        </span>
                      ) : (
                        `Complete Order with ${paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;


