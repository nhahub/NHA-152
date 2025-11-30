import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ShoppingBag, MapPin, CreditCard, Package, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { saveCouponFromPurchase, calculateDiscountForAmount } from "@/lib/coupon-utils";
import accImg from "../../assets/account.jpg";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const generatedCoupon = location.state?.generatedCoupon;
  const { user } = useSelector((state) => state.auth);

  // Save coupon when order is completed
  useEffect(() => {
    if (orderDetails?._id && user?.id) {
      // Check for pending coupon from PayPal flow
      const pendingCouponStr = sessionStorage.getItem("pendingCoupon");
      let couponToSave = generatedCoupon;

      if (pendingCouponStr) {
        try {
          const pendingCoupon = JSON.parse(pendingCouponStr);
          if (pendingCoupon.orderId === orderDetails._id) {
            couponToSave = pendingCoupon;
            sessionStorage.removeItem("pendingCoupon");
          }
        } catch (e) {
          console.error("Error parsing pending coupon:", e);
        }
      }

      // Calculate the original subtotal to determine if a coupon should be generated
      const originalSubtotal = orderDetails?.cartItems?.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      ) || 0;

      // If there was a generated coupon from the purchase, save it
      if (couponToSave && couponToSave.percentage > 0) {
        saveCouponFromPurchase(user.id, {
          ...couponToSave,
          orderId: orderDetails._id,
        });
      } else if (originalSubtotal >= 200) {
        // If no coupon was passed but the order qualifies, generate and save one
        const discount = calculateDiscountForAmount(originalSubtotal);
        if (discount.percentage > 0) {
          saveCouponFromPurchase(user.id, {
            ...discount,
            orderId: orderDetails._id,
          });
        }
      }
    }
  }, [orderDetails, user?.id, generatedCoupon]);

  const paymentMethodLabel =
    orderDetails?.paymentMethod === "cod"
      ? "Cash on Delivery"
      : orderDetails?.paymentMethod === "paypal"
      ? "PayPal"
      : orderDetails?.paymentMethod || "N/A";

  return (
    <div className="flex flex-col min-h-screen bg-[#EAF2FB] dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Success background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/80 via-[#2f3fbd]/70 to-[#3785D8]/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Order Completed Successfully!</h1>
            <p className="text-white/90 text-lg">Thank you for your purchase</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {orderDetails ? (
            <>
              {/* Order Items - Most Important, Show First */}
              <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Order Items</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {orderDetails?.cartItems?.length || 0} item(s) in your order
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
                      orderDetails.cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30"
                        >
                          <img
                            src={item.image || "https://via.placeholder.com/100"}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600 dark:text-slate-400">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-600 dark:text-slate-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No items found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary and Details - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                  <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Order Summary</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          Order details and payment
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Order ID</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {orderDetails?._id || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Order Status</span>
                        <Badge
                          className={
                            orderDetails?.orderStatus === "confirmed"
                              ? "bg-emerald-500 text-white"
                              : orderDetails?.orderStatus === "pending"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-500 text-white"
                          }
                        >
                          {orderDetails?.orderStatus || "pending"}
                        </Badge>
                      </div>
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-transparent bg-clip-text">
                            ${orderDetails?.totalAmount?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-slate-400">Payment Method</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {paymentMethodLabel}
                        </span>
                      </div>
                      {orderDetails?.orderDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-slate-400">Order Date</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(orderDetails.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                {orderDetails?.addressInfo && (
                  <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Shipping Address</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                            Delivery information
                          </p>
                        </div>
                      </div>
      </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2 text-gray-900 dark:text-white">
                        <p className="font-medium">
                          {orderDetails.addressInfo.address}, {orderDetails.addressInfo.city}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {orderDetails.addressInfo.pincode}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Phone: {orderDetails.addressInfo.phone}
                        </p>
                        {orderDetails.addressInfo.notes && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                              <span className="font-medium">Notes:</span> {orderDetails.addressInfo.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Button */}
              <Button
                onClick={() => navigate("/shop/account")}
                className="w-full h-12 text-base bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                View All Orders
                <ArrowRight className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Card className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment Completed Successfully!
                </h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Your order has been processed successfully.
                </p>
                <Button
                  onClick={() => navigate("/shop/account")}
                  className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
                >
        View Orders
      </Button>
              </CardContent>
    </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
