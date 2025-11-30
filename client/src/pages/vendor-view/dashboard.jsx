import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";

function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    confirmedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSellerInfo();
    }
  }, [user]);

  const handleToggleCustomProducts = async () => {
    if (!sellerInfo?._id) return;

    try {
      setIsUpdatingSettings(true);
      const newValue = !sellerInfo.allowCustomProducts;
      const response = await apiClient.put(
        API_ENDPOINTS.SHOP.VENDOR.UPDATE(sellerInfo._id),
        { allowCustomProducts: newValue }
      );

      if (response.data.success) {
        setSellerInfo(response.data.vendor);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const fetchSellerInfo = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.SELLER + `/${user.id}`
      );
      if (response.data.success) {
        const seller = response.data.data;
        setSellerInfo(seller);

        if (seller._id) {
          // Fetch products
          const productsRes = await apiClient.get(
            API_ENDPOINTS.VENDOR.PRODUCTS.GET(seller._id)
          );
          if (productsRes.data.success) {
            const productCount = productsRes.data.data.length;

            // Fetch orders
            const ordersRes = await apiClient.get(
              API_ENDPOINTS.VENDOR.ORDERS.GET(seller._id)
            );
            let orderCount = 0;
            let revenue = 0;
            let monthlyOrders = 0;
            let monthlyRevenue = 0;
            let confirmedOrders = 0;
            let pendingOrders = 0;
            let cancelledOrders = 0;

            if (ordersRes.data.success && ordersRes.data.data) {
              const orders = ordersRes.data.data;
              orderCount = orders.length;

              // Calculate revenue and monthly stats
              const now = new Date();
              const startOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
              );
              const endOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59
              );

              orders.forEach((order) => {
                const orderDate = new Date(order.orderDate);
                const orderTotal = parseFloat(order.vendorTotal) || 0;

                revenue += orderTotal;

                if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
                  monthlyOrders++;
                  monthlyRevenue += orderTotal;
                }

                // Count by status
                if (order.orderStatus === "confirmed" || order.orderStatus === "delivered") {
                  confirmedOrders++;
                } else if (order.orderStatus === "pending") {
                  pendingOrders++;
                } else if (order.orderStatus === "cancelled" || order.orderStatus === "rejected") {
                  cancelledOrders++;
                }
              });
            }

            setStats({
              totalProducts: productCount,
              totalOrders: orderCount,
              totalRevenue: revenue,
              monthlyOrders,
              monthlyRevenue,
              confirmedOrders,
              pendingOrders,
              cancelledOrders,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      if (error.response?.status === 404) {
        navigate("/shop/become-seller");
      }
    } finally {
      setLoading(false);
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
    const statusCopy =
      sellerInfo.status === "pending"
        ? "Your application is under review. Our team typically responds within 48 hours."
        : sellerInfo.status === "rejected"
        ? "Your application needs adjustments. Contact support to revisit criteria."
        : "Your account is currently paused. Reach out to re-activate your storefront.";

    return (
      <div className="space-y-8">
        <section className="rounded-[32px] bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white p-8 shadow-xl">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.3em] text-xs text-white/70">
              Vendor Account
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {sellerInfo.status === "pending"
                ? "Application under review"
                : sellerInfo.status === "rejected"
                ? "Application requires attention"
                : "Account temporarily suspended"}
            </h1>
            <p className="text-white/80 max-w-2xl">{statusCopy}</p>
          </div>
        </section>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      description: "Listings live on marketplace",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
      description: `$${stats.monthlyRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} this month`,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: "from-purple-500 to-pink-500",
      description: `${stats.monthlyOrders} orders this month`,
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: Calendar,
      gradient: "from-violet-500 to-purple-500",
      description: "Revenue this month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white p-8 shadow-xl">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-xs text-white/70">
            Vendor Dashboard
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            Welcome back, {sellerInfo.storeName}
          </h1>
          <p className="text-white/80 max-w-2xl">
            Monitor your store performance, track orders, and manage your
            products in real-time.
          </p>
        </div>
      </section>

      {/* Statistics Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Order Status Breakdown */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Order Status Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Confirmed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed orders
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.confirmedOrders}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Pending
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Awaiting processing
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.pendingOrders}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Cancelled
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cancelled orders
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.cancelledOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Store Settings
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-gray-600 dark:text-gray-400 mb-1">
                  Store Name
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sellerInfo.storeName}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {sellerInfo.storeCategory || "Not specified"}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs uppercase text-gray-600 dark:text-gray-400 mb-1">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {sellerInfo.status}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white px-4 py-1 rounded-full">
                  Active
                </Badge>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Allow Custom Products
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Enable customers to request customized products
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sellerInfo.allowCustomProducts || false}
                      onChange={handleToggleCustomProducts}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3785D8]/20 dark:peer-focus:ring-[#3785D8]/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-[#3785D8] peer-checked:to-[#BF8CE1]"></div>
                  </label>
                </div>
              </div>
              <Button
                onClick={() => navigate("/vendor/products")}
                className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-xl h-12 text-base font-semibold mt-4"
              >
                Manage Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default VendorDashboard;
