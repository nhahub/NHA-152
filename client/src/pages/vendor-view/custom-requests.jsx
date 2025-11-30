import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  DollarSign,
  FileText,
  Sparkles,
} from "lucide-react";

function VendorCustomRequests() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptFormData, setAcceptFormData] = useState({
    price: "",
    title: "",
    description: "",
    image: "",
  });
  const [rejectMessage, setRejectMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
          fetchCustomRequests(seller._id);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      setLoading(false);
    }
  };

  const fetchCustomRequests = async (sellerId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.VENDOR.CUSTOM_PRODUCT_REQUESTS(sellerId)
      );
      if (response.data.success) {
        setRequests(response.data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching custom requests:", error);
      toast({
        title: "Error",
        description: "Failed to load custom product requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedRequest || !acceptFormData.price || !acceptFormData.title) {
      toast({
        title: "Error",
        description: "Please fill in price and title",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiClient.post(
        API_ENDPOINTS.SHOP.VENDOR.ACCEPT_CUSTOM_REQUEST(selectedRequest._id),
        {
          price: parseFloat(acceptFormData.price),
          title: acceptFormData.title,
          description: acceptFormData.description || selectedRequest.productDescription,
          image: acceptFormData.image || "",
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Custom product request accepted and added to user's cart",
        });
        setAcceptDialogOpen(false);
        setSelectedRequest(null);
        setAcceptFormData({ price: "", title: "", description: "", image: "" });
        if (sellerInfo?._id) {
          fetchCustomRequests(sellerInfo._id);
        }
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setIsProcessing(true);
      const response = await apiClient.post(
        API_ENDPOINTS.SHOP.VENDOR.REJECT_CUSTOM_REQUEST(selectedRequest._id),
        {
          vendorResponse: rejectMessage || "Request rejected",
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Custom product request rejected",
        });
        setRejectDialogOpen(false);
        setSelectedRequest(null);
        setRejectMessage("");
        if (sellerInfo?._id) {
          fetchCustomRequests(sellerInfo._id);
        }
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-amber-500 text-white" },
      accepted: { label: "Accepted", className: "bg-emerald-500 text-white" },
      rejected: { label: "Rejected", className: "bg-red-500 text-white" },
      completed: { label: "Completed", className: "bg-blue-500 text-white" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.className}>{config.label}</Badge>
    );
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
          Your vendor account must be approved to view custom product requests.
        </p>
        <Button onClick={() => navigate("/shop/home")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const otherRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Custom Product Requests
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage custom product requests from customers
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No custom product requests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="grid gap-4">
                {pendingRequests.map((request) => (
                  <Card
                    key={request._id}
                    className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Request from {request.userName}
                              </h4>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Product Description
                          </Label>
                          <p className="text-gray-900 dark:text-white mt-1">
                            {request.productDescription}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Quantity
                            </Label>
                            <p className="text-gray-900 dark:text-white mt-1">
                              {request.quantity}
                            </p>
                          </div>
                          {request.estimatedBudget && (
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estimated Budget
                              </Label>
                              <p className="text-gray-900 dark:text-white mt-1">
                                ${request.estimatedBudget.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>

                        {request.specialRequirements && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Special Requirements
                            </Label>
                            <p className="text-gray-900 dark:text-white mt-1">
                              {request.specialRequirements}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{request.userName}</span>
                          <Mail className="w-4 h-4 ml-2" />
                          <span>{request.userEmail}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Dialog
                          open={acceptDialogOpen && selectedRequest?._id === request._id}
                          onOpenChange={(open) => {
                            setAcceptDialogOpen(open);
                            if (open) {
                              setSelectedRequest(request);
                              setAcceptFormData({
                                price: request.estimatedBudget
                                  ? request.estimatedBudget.toString()
                                  : "",
                                title: "",
                                description: request.productDescription,
                                image: "",
                              });
                            } else {
                              setSelectedRequest(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAcceptFormData({
                                  price: request.estimatedBudget
                                    ? request.estimatedBudget.toString()
                                    : "",
                                  title: "",
                                  description: request.productDescription,
                                  image: "",
                                });
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Accept Custom Product Request</DialogTitle>
                              <DialogDescription>
                                Set the product details and price. The product will be
                                automatically added to the customer's cart.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={acceptFormData.price}
                                  onChange={(e) =>
                                    setAcceptFormData({
                                      ...acceptFormData,
                                      price: e.target.value,
                                    })
                                  }
                                  className="mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="title">Product Title *</Label>
                                <Input
                                  id="title"
                                  value={acceptFormData.title}
                                  onChange={(e) =>
                                    setAcceptFormData({
                                      ...acceptFormData,
                                      title: e.target.value,
                                    })
                                  }
                                  className="mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={acceptFormData.description}
                                  onChange={(e) =>
                                    setAcceptFormData({
                                      ...acceptFormData,
                                      description: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="image">Image URL (Optional)</Label>
                                <Input
                                  id="image"
                                  type="url"
                                  value={acceptFormData.image}
                                  onChange={(e) =>
                                    setAcceptFormData({
                                      ...acceptFormData,
                                      image: e.target.value,
                                    })
                                  }
                                  className="mt-1"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                              <Button
                                onClick={handleAccept}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
                              >
                                {isProcessing ? "Processing..." : "Accept & Add to Cart"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={rejectDialogOpen && selectedRequest?._id === request._id}
                          onOpenChange={(open) => {
                            setRejectDialogOpen(open);
                            if (open) {
                              setSelectedRequest(request);
                            } else {
                              setSelectedRequest(null);
                              setRejectMessage("");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => {
                                setSelectedRequest(request);
                                setRejectMessage("");
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Custom Product Request</DialogTitle>
                              <DialogDescription>
                                Provide a reason for rejecting this request (optional).
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label htmlFor="rejectMessage">Rejection Reason</Label>
                                <Textarea
                                  id="rejectMessage"
                                  value={rejectMessage}
                                  onChange={(e) => setRejectMessage(e.target.value)}
                                  rows={3}
                                  className="mt-1"
                                  placeholder="Optional message to the customer..."
                                />
                              </div>
                              <Button
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="w-full bg-red-500 hover:bg-red-600 text-white"
                              >
                                {isProcessing ? "Processing..." : "Reject Request"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Requests */}
          {otherRequests.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Processed Requests ({otherRequests.length})
              </h3>
              <div className="grid gap-4">
                {otherRequests.map((request) => (
                  <Card
                    key={request._id}
                    className="rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Request from {request.userName}
                              </h4>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-900 dark:text-white">
                          <strong>Description:</strong> {request.productDescription}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VendorCustomRequests;

