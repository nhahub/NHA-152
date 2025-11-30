import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import {
  Store,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS.STATISTICS);
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
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

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Vendors",
      value: statistics.vendors.total,
      icon: Store,
      gradient: "from-blue-500 to-cyan-500",
      description: `${statistics.vendors.pending} pending approval`,
    },
    {
      title: "Total Revenue",
      value: `$${statistics.revenue.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
      description: `$${statistics.revenue.monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month`,
    },
    {
      title: "Total Orders",
      value: statistics.orders.total,
      icon: ShoppingBag,
      gradient: "from-purple-500 to-pink-500",
      description: `${statistics.orders.monthly} orders this month`,
    },
    {
      title: "Total Products",
      value: statistics.products.total,
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      description: "Across all vendors",
    },
    {
      title: "Average Order Value",
      value: `$${statistics.averageOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: "from-indigo-500 to-blue-500",
      description: "Per transaction",
    },
    {
      title: "Monthly Sales",
      value: statistics.orders.monthly,
      icon: Calendar,
      gradient: "from-violet-500 to-purple-500",
      description: "Orders this month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-[32px] bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white p-8 shadow-xl">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.3em] text-xs text-white/70">
            Admin Dashboard
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            Marketplace Overview & Statistics
          </h1>
          <p className="text-white/80 max-w-2xl">
            Monitor your marketplace performance, track vendor activity, and analyze sales data
            in real-time.
          </p>
        </div>
      </section>

      {/* Statistics Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
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
                    <p className="font-medium text-gray-900 dark:text-white">Confirmed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed orders</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {statistics.orders.confirmed}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pending</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting processing</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {statistics.orders.pending}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Cancelled</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled orders</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {statistics.orders.cancelled}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Vendor Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Active Vendors</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approved and operating</p>
                  </div>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  {statistics.vendors.total}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pending Approval</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting review</p>
                  </div>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
                  {statistics.vendors.pending}
                </p>
              </div>

              <Button
                onClick={() => navigate("/admin/vendors")}
                className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-xl h-12 text-base font-semibold"
              >
                Manage Vendors
              </Button>
      </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default AdminDashboard;
