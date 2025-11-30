import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Package, ShoppingBag, MapPin, CreditCard, Calendar, DollarSign } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const paymentMethodLabel =
    orderDetails?.paymentMethod === "cod"
      ? "Cash on Delivery"
      : orderDetails?.paymentMethod === "paypal"
      ? "PayPal"
      : orderDetails?.paymentMethod || "N/A";

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] border-0 bg-transparent p-0 overflow-hidden">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          <div className="p-6 md:p-8 space-y-6">
          {/* Order Summary */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Order Summary</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Order details and payment information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order ID
                  </span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {orderDetails?._id || "N/A"}
                  </span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order Date
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A"}
                  </span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-transparent bg-clip-text">
                    ${orderDetails?.totalAmount?.toFixed(2) || "0.00"}
                  </span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {paymentMethodLabel}
                  </span>
          </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-slate-400">Payment Status</span>
                  <Badge
                    className={
                      orderDetails?.paymentStatus === "completed"
                        ? "bg-emerald-500 text-white"
                        : orderDetails?.paymentStatus === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-500 text-white"
                    }
                  >
                    {orderDetails?.paymentStatus || "pending"}
                  </Badge>
          </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-slate-400">Order Status</span>
              <Badge
                    className={`py-1.5 px-3 rounded-full font-medium ${
                  orderDetails?.orderStatus === "confirmed"
                        ? "bg-emerald-500 text-white"
                    : orderDetails?.orderStatus === "rejected"
                        ? "bg-red-600 text-white"
                        : orderDetails?.orderStatus === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    {orderDetails?.orderStatus || "pending"}
              </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Order Items</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    {orderDetails?.cartItems?.length || 0} item(s) in this order
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

          {/* Shipping Address */}
          {orderDetails?.addressInfo && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Shipping Address</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      Delivery information
                    </p>
          </div>
        </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2 text-gray-900 dark:text-white">
                  <p className="font-semibold text-lg mb-2">{user?.userName || "N/A"}</p>
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
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
