import React, { useState } from "react";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import img from "../../assets/account.jpg";
import { FaPaypal, FaMoneyBillAlt } from "react-icons/fa";

// مكوّن Address مدمج مع اختيار العنوان
function Address({ selectedId, setCurrentSelectedAddress }) {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { toast } = useToast();

  const handleSaveAddress = () => {
    if (!address || !city || !pincode || !phone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const newAddress = {
      _id: Date.now(),
      address,
      city,
      pincode,
      phone,
      notes,
    };

    setSavedAddresses(prev => [...prev, newAddress]);
    setCurrentSelectedAddress(newAddress);
    toast({ title: "Address saved successfully", variant: "default" });

    setAddress("");
    setCity("");
    setPincode("");
    setPhone("");
    setNotes("");
  };

  return (
    <div className="border p-5 rounded shadow-sm bg-white">
      <h3 className="font-bold mb-3 text-lg">Shipping Address</h3>

      {/* قائمة العناوين المحفوظة */}
      {savedAddresses.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {savedAddresses.map(addr => (
            <div
              key={addr._id}
              className={`border p-2 rounded cursor-pointer ${
                selectedId?._id === addr._id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentSelectedAddress(addr)}
            >
              <p className="font-medium">{addr.address}, {addr.city}</p>
              <p className="text-sm text-gray-600">{addr.pincode} - {addr.phone}</p>
              {addr.notes && <p className="text-sm text-gray-500">Notes: {addr.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* فورم إضافة عنوان جديد */}
      <div className="grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={e => setPincode(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Notes (Optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSaveAddress}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full mt-2"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

// باقي كود ShoppingCheckout يظل كما هو مع مكوّن Address الجديد
function ShoppingCheckout() {
  const { cartItems } = useSelector(state => state.shopCart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount =
    cartItems?.items?.reduce(
      (sum, item) =>
        sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) || 0;

  const handleInitiatePayment = () => {
    if (!cartItems?.items?.length) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    if (!currentSelectedAddress) {
      toast({ title: "Please select an address", variant: "destructive" });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(item => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes || "",
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then(data => {
      if (data?.payload?.success) {
        if (paymentMethod === "paypal" && data?.payload?.approvalURL) {
          setIsPaymentStart(true);
          window.location.href = data.payload.approvalURL;
        } else {
          navigate("/shop/payment-success", { state: { orderDetails: orderData } });
        }
      } else {
        toast({ title: "Error creating order", variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[250px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            {cartItems?.items?.map(item => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          </div>

          <div className="mt-4 p-4 border rounded bg-white shadow-sm">
            <p className="font-bold text-lg mb-3">Total: ${totalCartAmount}</p>

            <h4 className="font-medium mb-2">Select Payment Method:</h4>
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                  paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <FaPaypal className="text-blue-600 text-xl" />
                <span>PayPal</span>
              </div>

              <div
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                  paymentMethod === "cod" ? "border-green-500 bg-green-50" : ""
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <FaMoneyBillAlt className="text-green-600 text-xl" />
                <span>Cash on Delivery</span>
              </div>
            </div>

            <Button onClick={handleInitiatePayment} className="w-full mt-4">
              {isPaymentStart
                ? `Processing ${paymentMethod === "paypal" ? "PayPal" : "Payment"}...`
                : `Checkout with ${paymentMethod === "paypal" ? "PayPal" : "Cash on Delivery"}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
