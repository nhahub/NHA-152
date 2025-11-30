import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import apiClient, { API_ENDPOINTS } from "@/config/api";

const initialFormData = {
  orderStatus: "",
};

function VendorOrderDetailsView({ orderDetails, sellerId, onOrderUpdated }) {
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { orderStatus } = formData;

    if (!orderStatus) {
      toast({
        title: "Error",
        description: "Please select an order status",
        variant: "destructive",
      });
      return;
    }

    apiClient
      .put(
        API_ENDPOINTS.VENDOR.ORDERS.UPDATE(sellerId, orderDetails._id),
        { orderStatus }
      )
      .then((response) => {
        if (response.data.success) {
          toast({
            title: "Success",
            description: response.data.message || "Order status updated successfully",
          });
          setFormData(initialFormData);
          if (onOrderUpdated) {
            onOrderUpdated();
          }
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update order status",
          variant: "destructive",
        });
      });
  }

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label className="font-mono text-sm">{orderDetails._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>
              {orderDetails.orderDate
                ? new Date(orderDetails.orderDate).toLocaleDateString()
                : "N/A"}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Vendor Total</p>
            <Label className="font-semibold">
              ${orderDetails.vendorTotal?.toFixed(2) || "0.00"}
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails.paymentMethod || "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails.paymentStatus || "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails.orderStatus === "confirmed" ||
                  orderDetails.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails.orderStatus === "inShipping"
                    ? "bg-blue-500"
                    : orderDetails.orderStatus === "inProcess"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              >
                {orderDetails.orderStatus || "pending"}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Items (Your Products)</div>
            <ul className="grid gap-3">
              {orderDetails.vendorItems && orderDetails.vendorItems.length > 0
                ? orderDetails.vendorItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-semibold">${item.price}</span>
                      </div>
                    </li>
                  ))
                : (
                  <li className="text-muted-foreground">No items found</li>
                )}
            </ul>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Information</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{orderDetails.addressInfo?.address || "N/A"}</span>
              <span>
                {orderDetails.addressInfo?.city || ""}{" "}
                {orderDetails.addressInfo?.pincode || ""}
              </span>
              <span>Phone: {orderDetails.addressInfo?.phone || "N/A"}</span>
              {orderDetails.addressInfo?.notes && (
                <span className="mt-2">
                  Notes: {orderDetails.addressInfo.notes}
                </span>
              )}
            </div>
          </div>
        </div>

        <Separator />
        <div>
          <CommonForm
            formControls={[
              {
                label: "Update Order Status",
                name: "orderStatus",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default VendorOrderDetailsView;


