import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Card, CardContent } from "../ui/card";
import { ShoppingBag, ArrowRight } from "lucide-react";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-[#EAF2FB] dark:bg-slate-900">
      <SheetHeader className="border-b border-gray-300 dark:border-gray-700 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Cart
            </SheetTitle>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </SheetHeader>

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scroll">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent 
                key={item.productId || item._id || Math.random()} 
                cartItem={item} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start adding items to your cart</p>
            </div>
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-[#3785D8] dark:text-[#BF8CE1]">
                    ${totalCartAmount.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    navigate("/shop/checkout");
                    setOpenCartSheet(false);
                  }}
                  className="w-full h-12 text-base bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white rounded-xl shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
