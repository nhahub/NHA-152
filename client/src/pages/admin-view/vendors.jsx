import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MoreVertical, CheckCircle, XCircle, Ban, Trash2, Eye } from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useNavigate } from "react-router-dom";
import "@/styles/shop-listing.css";

function AdminVendors() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "pending"
  const [currentPage, setCurrentPage] = useState(1);
  const VENDORS_PER_PAGE = 12;

  useEffect(() => {
    fetchVendors();
    fetchPendingVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.VENDORS.GET);
      if (response.data.success) {
        setVendors(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVendors = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.VENDORS.PENDING);
      if (response.data.success) {
        setPendingVendors(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.APPROVE(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor approved successfully",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.REJECT(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor application rejected",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (sellerId) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.ADMIN.VENDORS.SUSPEND(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor suspended successfully",
        });
        fetchVendors();
      }
    } catch (error) {
      console.error("Error suspending vendor:", error);
      toast({
        title: "Error",
        description: "Failed to suspend vendor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (sellerId) => {
    if (!window.confirm("Are you sure you want to delete this vendor? This will also delete all their products.")) {
      return;
    }

    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.ADMIN.VENDORS.DELETE(sellerId)
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully",
        });
        fetchVendors();
        fetchPendingVendors();
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
      suspended: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const displayVendors = activeTab === "pending" ? pendingVendors : vendors;

  // Calculate pagination
  const totalPages = Math.ceil((displayVendors?.length || 0) / VENDORS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (safePage - 1) * VENDORS_PER_PAGE;
  const endIndex = startIndex + VENDORS_PER_PAGE;
  const currentVendors = displayVendors?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vendor Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage vendor applications and existing vendors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#EAF2FB] dark:bg-slate-700 rounded-2xl p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all"
        >
          All Vendors ({vendors.length})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-white data-[state=active]:text-[#1E0F75] data-[state=active]:shadow-md rounded-xl transition-all"
          >
            Pending ({pendingVendors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {displayVendors.length === 0 ? (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {activeTab === "pending"
                    ? "No pending vendor applications"
                    : "No vendors found"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white hover:bg-gradient-to-r hover:from-[#1E0F75] hover:via-[#2f3fbd] hover:to-[#3785D8]">
                          <TableHead className="font-semibold text-white">Store Name</TableHead>
                          <TableHead className="font-semibold text-white">Email</TableHead>
                          <TableHead className="font-semibold text-white">Category</TableHead>
                          <TableHead className="font-semibold text-white">Business Type</TableHead>
                          <TableHead className="font-semibold text-white">Status</TableHead>
                          <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVendors.map((vendor) => (
                          <TableRow 
                            key={vendor._id}
                            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <TableCell className="font-medium text-gray-900 dark:text-white">
                              {vendor.storeName}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {vendor.userId?.email || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {vendor.storeCategory || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 capitalize">
                              {vendor.businessType || "N/A"}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(vendor.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/shop/vendor/${vendor._id}`)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Store
                                  </DropdownMenuItem>
                                  {vendor.status === "pending" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleApprove(vendor._id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleReject(vendor._id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {vendor.status === "approved" && (
                                    <DropdownMenuItem
                                      onClick={() => handleSuspend(vendor._id)}
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Suspend
                                    </DropdownMenuItem>
                                  )}
                                  {vendor.status === "suspended" && (
                                    <DropdownMenuItem
                                      onClick={() => handleApprove(vendor._id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Reactivate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(vendor._id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="shop-pagination mt-8">
                  <button
                    className="shop-nav-btn"
                    onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`shop-page-btn ${safePage === i + 1 ? "active" : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                      aria-current={safePage === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="shop-nav-btn"
                    onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminVendors;


