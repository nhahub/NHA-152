import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import apiClient, { API_ENDPOINTS } from "@/config/api";

const WishlistButton = ({ productId, className = "", size = "icon" }) => {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id && productId) {
      checkWishlistStatus();
    }
  }, [user, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHOP.WISHLIST.CHECK, {
        params: {
          userId: user.id,
          productId,
        },
      });
      if (response.data.success) {
        setIsInWishlist(response.data.isInWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events

    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await apiClient.post(API_ENDPOINTS.SHOP.WISHLIST.REMOVE, {
          userId: user.id,
          productId,
        });
        if (response.data.success) {
          setIsInWishlist(false);
          toast({
            title: "Removed",
            description: "Product removed from wishlist",
          });
        }
      } else {
        // Add to wishlist
        const response = await apiClient.post(API_ENDPOINTS.SHOP.WISHLIST.ADD, {
          userId: user.id,
          productId,
        });
        if (response.data.success) {
          setIsInWishlist(true);
          toast({
            title: "Added",
            description: "Product added to wishlist",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      const errorMessage =
        error.response?.data?.message ||
        (isInWishlist
          ? "Failed to remove from wishlist"
          : "Failed to add to wishlist");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      className={`${className} ${isInWishlist ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
    >
      <Heart
        className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""} ${isLoading ? "opacity-50" : ""}`}
      />
    </Button>
  );
};

export default WishlistButton;

