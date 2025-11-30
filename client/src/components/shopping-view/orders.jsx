import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Package } from "lucide-react";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order History</h2>
        <p className="text-gray-700 dark:text-slate-200">View and manage all your past orders</p>
      </div>

      {orderList && orderList.length > 0 ? (
        <div className="space-y-4">
          {orderList.map((orderItem) => (
            <Card 
              key={orderItem?._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Order ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {orderItem?._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {orderItem?.orderDate.split("T")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Status</p>
                    <Badge
                      className={`py-1.5 px-3 rounded-full font-medium ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-emerald-500 text-white"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600 text-white"
                          : orderItem?.orderStatus === "pending"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-600 text-white"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <p className="text-sm text-gray-600 dark:text-slate-400">Total</p>
                    <p className="text-xl font-bold text-[#3785D8] dark:text-[#BF8CE1]">
                      ${orderItem?.totalAmount}
                    </p>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-lg"
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-slate-300 text-lg font-medium">
              No orders yet
            </p>
            <p className="text-gray-600 dark:text-slate-400 text-sm mt-2">
              Start shopping to see your orders here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ShoppingOrders;
