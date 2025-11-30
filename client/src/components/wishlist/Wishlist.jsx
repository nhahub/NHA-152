import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.SHOP.WISHLIST.GET(user.id));
      if (response.data.success) {
        setWishlistProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to manage your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      setRemovingIds((prev) => new Set(prev).add(productId));
      const response = await apiClient.post(API_ENDPOINTS.SHOP.WISHLIST.REMOVE, {
        userId: user.id,
        productId,
      });

      if (response.data.success) {
        setWishlistProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
        toast({
          title: "Removed",
          description: "Product removed from wishlist",
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from wishlist",
        variant: "destructive",
      });
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  const handleAddToCart = async (productId) => {
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    try {
      dispatch(
        addToCart({
          userId: user.id,
          productId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast({
            title: "Added to cart",
            description: "Product added to cart successfully",
          });
        }
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="w-full p-6" style={{ background: "#CBD8E8" }}>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#1C1DAB" }}>Please Login</h1>
          <p className="mb-6" style={{ color: "#1C1DAB" }}>You need to be logged in to view your wishlist</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="text-white px-6 py-2 rounded-md"
            style={{
              background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-6" style={{ background: "#CBD8E8" }}>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "#1C1DAB" }}></div>
          <p style={{ color: "#1C1DAB" }}>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="w-full p-6" style={{ background: "#CBD8E8" }}>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#1C1DAB" }}>Your wishlist is empty</h2>
          <p className="mb-8" style={{ color: "#1C1DAB" }}>
            Start adding products you love to your wishlist
          </p>
          <button
            onClick={() => navigate("/shop/listing")}
            className="text-white px-6 py-2 rounded-md"
            style={{
              background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6" style={{ background: "#CBD8E8" }}>
      <div
        className="overflow-x-auto border rounded-xl shadow-sm"
        style={{ background: "#FFFFFF" }}
      >
        <table className="w-full text-left">
          {/* === HEADER — SAME COLOR AS ADD TO CART === */}
          <thead
            style={{
              background: "linear-gradient(135deg,#1C1DAB,#3785D8)",
              color: "#FFFFFF",
            }}
            className="text-sm font-semibold"
          >
            <tr>
              <th className="p-4">Delete</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          {/* === BODY === */}
          <tbody>
            {wishlistProducts.map((product) => {
              const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
              const originalPrice = product.salePrice > 0 ? product.price : null;
              const rating = product.averageReview || 0;
              const reviews = product.reviews || product.reviewsCount || 0;
              const isRemoving = removingIds.has(product._id);
              const stockStatus = product.totalStock > 0 ? "In Stock" : "Out of Stock";
              const tags = product.category ? [product.category] : [];

              return (
                <tr key={product._id} className="border-b">
                  {/* REMOVE */}
                  <td
                    className="p-4 text-gray-600 cursor-pointer flex items-center gap-1"
                    style={{ color: "#1C1DAB" }}
                    onClick={() => !isRemoving && handleRemoveFromWishlist(product._id)}
                  >
                    {isRemoving ? "⏳ Removing..." : "❌ Remove"}
                  </td>

                  {/* PRODUCT */}
                  <td className="p-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"}
                        alt={product.title}
                        className="w-24 h-24 rounded-lg object-cover border transform transition duration-300 hover:scale-105 active:scale-110 cursor-pointer"
                        style={{ borderColor: "#ADC6E5" }}
                        onClick={() => handleGetProductDetails(product._id)}
                      />

                      <div>
                        <h2
                          className="font-semibold cursor-pointer"
                          style={{ color: "#1C1DAB" }}
                          onClick={() => handleGetProductDetails(product._id)}
                        >
                          {product.title}
                        </h2>

                        <div className="flex items-center gap-2 text-sm mt-1">
                          <span
                            className="text-base font-semibold"
                            style={{ color: "#1C1DAB" }}
                          >
                            ★ {rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500">
                            {reviews} Reviews
                          </span>
                        </div>

                        {tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-md text-xs text-white"
                                style={{
                                  background:
                                    "linear-gradient(135deg,#1C1DAB,#3785D8)",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td
                    className="p-4 font-semibold"
                    style={{ color: "#1C1DAB" }}
                  >
                    ${displayPrice.toFixed(2)}
                    {originalPrice && (
                      <span className="text-gray-400 line-through text-sm ml-2">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* STOCK */}
                  <td
                    className="p-4 font-semibold"
                    style={{ color: "#1C1DAB" }}
                  >
                    {stockStatus}
                  </td>

                  {/* BUTTON */}
                  <td className="p-4">
                    <button
                      className="text-white px-6 py-2 rounded-md flex items-center gap-2"
                      style={{
                        background:
                          "linear-gradient(135deg,#1C1DAB,#3785D8)",
                      }}
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.totalStock === 0}
                    >
                      Add To Cart 🛒
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={(open) => {
          setOpenDetailsDialog(open);
          if (!open) {
            dispatch(setProductDetails());
          }
        }}
        productDetails={productDetails}
      />
    </div>
  );
};

export default Wishlist;

