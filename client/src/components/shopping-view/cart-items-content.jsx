import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const getProductId = (item) => {
    if (typeof item?.productId === 'object' && item?.productId?._id) {
      return item.productId._id;
    }
    return item?.productId;
  };

  async function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (!user?.id) {
      toast({
        title: "Please login to update cart",
        variant: "destructive",
      });
      return;
    }

    const productId = getProductId(getCartItem);
    if (!productId) {
      toast({
        title: "Product ID not found",
        variant: "destructive",
      });
      return;
    }

    if (typeOfAction === "plus") {
      let getCartItems = cartItems?.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => getProductId(item) === productId
        );

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          
          // Check stock if productList is available
          if (productList && productList.length > 0) {
            const getCurrentProductIndex = productList.findIndex(
              (product) => product._id === productId
            );
            
            if (getCurrentProductIndex > -1) {
              const getTotalStock = productList[getCurrentProductIndex].totalStock;
              if (getQuantity + 1 > getTotalStock) {
                toast({
                  title: `Only ${getQuantity} quantity can be added for this item`,
                  variant: "destructive",
                });
                return;
              }
            }
          }
        }
      }
    }

    const newQuantity = typeOfAction === "plus"
      ? getCartItem?.quantity + 1
      : Math.max(1, getCartItem?.quantity - 1);

    try {
      const result = await dispatch(
        updateCartQuantity({
          userId: user.id,
          productId: productId,
          quantity: newQuantity,
        })
      );

      if (result?.payload?.success) {
        // Refresh cart items to update UI
        await dispatch(fetchCartItems(user.id));
        toast({
          title: "Cart updated successfully",
        });
      } else {
        toast({
          title: "Failed to update cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error updating cart",
        variant: "destructive",
      });
    }
  }

  async function handleCartItemDelete(getCartItem) {
    if (!user?.id) {
      toast({
        title: "Please login to delete cart items",
        variant: "destructive",
      });
      return;
    }

    const productId = getProductId(getCartItem);
    if (!productId) {
      toast({
        title: "Product ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await dispatch(
        deleteCartItem({ 
          userId: user.id, 
          productId: productId 
        })
      );

      if (result?.payload?.success) {
        // Refresh cart items to update UI
        await dispatch(fetchCartItems(user.id));
        toast({
          title: "Item removed from cart",
        });
      } else {
        toast({
          title: "Failed to remove item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast({
        title: "Error removing item",
        variant: "destructive",
      });
    }
  }

  const itemPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const totalPrice = itemPrice * cartItem?.quantity;

  return (
    <Card className="bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={cartItem?.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e"}
              alt={cartItem?.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 line-clamp-2">
              {cartItem?.title}
            </h3>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="icon"
                  disabled={cartItem?.quantity === 1}
                  onClick={() => handleUpdateQuantity(cartItem, "minus")}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-gray-900 dark:text-white w-8 text-center">
                  {cartItem?.quantity}
                </span>
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="icon"
                  onClick={() => handleUpdateQuantity(cartItem, "plus")}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-lg text-[#3785D8] dark:text-[#BF8CE1]">
                    ${totalPrice.toFixed(2)}
                  </p>
                  {cartItem?.salePrice > 0 && (
                    <p className="text-xs text-gray-500 line-through">
                      ${(cartItem?.price * cartItem?.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleCartItemDelete(cartItem)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCartItemsContent;
