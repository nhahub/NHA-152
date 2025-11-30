import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import VendorOrderDetailsView from "@/components/vendor-view/order-details";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

function VendorOrders() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSellerInfo();
    }
  }, [user]);

  const fetchSellerInfo = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.SELLER + `/${user.id}`
      );
      if (response.data.success) {
        const seller = response.data.data;
        setSellerInfo(seller);
        if (seller.status === "approved" && seller._id) {
          fetchOrders(seller._id);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      setLoading(false);
    }
  };

  const fetchOrders = async (sellerId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.VENDOR.ORDERS.GET(sellerId)
      );
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrderDetails = async (orderId) => {
    if (!sellerInfo?._id) return;

    try {
      const response = await apiClient.get(
        API_ENDPOINTS.VENDOR.ORDERS.DETAILS(sellerInfo._id, orderId)
      );
      if (response.data.success) {
        setOrderDetails(response.data.data);
        setOpenDetailsDialog(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  const handleOrderUpdated = () => {
    if (sellerInfo?._id) {
      fetchOrders(sellerInfo._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8]"></div>
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No vendor account found
        </p>
        <Button onClick={() => navigate("/shop/become-seller")}>
          Become a Seller
        </Button>
      </div>
    );
  }

  if (sellerInfo.status !== "approved") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your vendor account must be approved to view orders.
        </p>
        <Button onClick={() => navigate("/shop/home")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Orders Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage orders for your products
        </p>
      </div>

      <Card className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white hover:bg-gradient-to-r hover:from-[#1E0F75] hover:via-[#2f3fbd] hover:to-[#3785D8]">
                    <TableHead className="font-semibold text-white">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Order Date
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Items
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Order Status
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      Total Amount
                    </TableHead>
                    <TableHead className="font-semibold text-white text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                        {order._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {order.totalItems || 0} items
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            order.orderStatus === "confirmed" ||
                            order.orderStatus === "delivered"
                              ? "bg-green-500 text-white"
                              : order.orderStatus === "rejected"
                              ? "bg-red-600 text-white"
                              : order.orderStatus === "inShipping"
                              ? "bg-blue-500 text-white"
                              : order.orderStatus === "inProcess"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {order.orderStatus || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        ${order.vendorTotal?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={(open) => {
                            setOpenDetailsDialog(open);
                            if (!open) setOrderDetails(null);
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(order._id)}
                            variant="outline"
                            className="border-[#3785D8] text-[#3785D8] hover:bg-[#3785D8] hover:text-white"
                          >
                            View Details
                          </Button>
                          {orderDetails && (
                            <VendorOrderDetailsView
                              orderDetails={orderDetails}
                              sellerId={sellerInfo._id}
                              onOrderUpdated={handleOrderUpdated}
                            />
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VendorOrders;
