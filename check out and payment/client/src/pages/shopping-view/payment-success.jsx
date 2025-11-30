import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


import { useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) return <p>No order details found.</p>;
  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl mb-4">Order Completed Successfully!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p><strong>Order ID:</strong> {orderDetails?._id}</p>
          <p><strong>Total Amount:</strong> ${orderDetails?.totalAmount}</p>
          <p><strong>Payment Method:</strong> {orderDetails?.paymentMethod}</p>
          <p><strong>Order Status:</strong> {orderDetails?.orderStatus}</p>
        </div>
        <div>
          <h3 className="font-bold">Shipping Address</h3>
          <p>{orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city}</p>
          <p>{orderDetails?.addressInfo?.pincode}</p>
          <p>Phone: {orderDetails?.addressInfo?.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
}



export default PaymentSuccessPage;
