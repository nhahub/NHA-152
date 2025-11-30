import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import ProductImageUpload from "@/components/admin-view/image-upload";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Save, X, Star, Sparkles } from "lucide-react";
import { fetchProductDetails } from "@/store/shop/products-slice";

const VendorProfilePage = () => {
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { toast } = useToast();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    storeName: "",
    description: "",
    profilePic: "",
    backgroundImage: "",
  });

  // Image upload states
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [profilePicLoading, setProfilePicLoading] = useState(false);

  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [backgroundImageLoading, setBackgroundImageLoading] = useState(false);

  // Check if current user is the vendor owner
  const isVendorOwner = useMemo(() => {
    if (!user || !vendor || !vendor.userId) return false;
    const userId = user.id || user._id;
    const vendorUserId = vendor.userId._id || vendor.userId;
    return userId && vendorUserId && userId.toString() === vendorUserId.toString();
  }, [user, vendor]);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const [vendorRes, productsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.SHOP.VENDOR.PROFILE(sellerId)),
          apiClient.get(API_ENDPOINTS.SHOP.VENDOR.PRODUCTS(sellerId)),
        ]);

        if (vendorRes.data.success) {
          setVendor(vendorRes.data.vendor);
          // Initialize edit form data
          setEditFormData({
            storeName: vendorRes.data.vendor.storeName || "",
            description: vendorRes.data.vendor.description || "",
            profilePic: vendorRes.data.vendor.profilePic || "",
            backgroundImage: vendorRes.data.vendor.backgroundImage || "",
          });
        }

        if (productsRes.data.success) {
          setProducts(productsRes.data.products);
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to load vendor profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchVendorData();
    }
  }, [sellerId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === "reviews" && sellerId) {
        try {
          const response = await apiClient.get(
            API_ENDPOINTS.SHOP.VENDOR.REVIEWS(sellerId)
          );
          if (response.data.success) {
            setReviews(response.data.reviews);
          }
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      }
    };

    fetchReviews();
  }, [activeTab, sellerId]);

  const handleEditToggle = () => {
    if (isEditMode && vendor) {
      // Cancel edit - reset form data
      setEditFormData({
        storeName: vendor.storeName || "",
        description: vendor.description || "",
        profilePic: vendor.profilePic || "",
        backgroundImage: vendor.backgroundImage || "",
      });
      setProfilePicFile(null);
      setProfilePicUrl("");
      setBackgroundImageFile(null);
      setBackgroundImageUrl("");
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Prepare update data
      const updateData = {
        storeName: editFormData.storeName,
        description: editFormData.description,
      };

      // Use uploaded image URLs if available, otherwise use existing URLs
      if (profilePicUrl) {
        updateData.profilePic = profilePicUrl;
      } else if (editFormData.profilePic) {
        updateData.profilePic = editFormData.profilePic;
      }

      if (backgroundImageUrl) {
        updateData.backgroundImage = backgroundImageUrl;
      } else if (editFormData.backgroundImage) {
        updateData.backgroundImage = editFormData.backgroundImage;
      }

      const response = await apiClient.put(
        API_ENDPOINTS.SHOP.VENDOR.UPDATE(sellerId),
        updateData
      );

      if (response.data.success) {
        setVendor(response.data.vendor);
        setEditFormData({
          storeName: response.data.vendor.storeName || "",
          description: response.data.vendor.description || "",
          profilePic: response.data.vendor.profilePic || "",
          backgroundImage: response.data.vendor.backgroundImage || "",
        });
        setIsEditMode(false);
        setProfilePicFile(null);
        setProfilePicUrl("");
        setBackgroundImageFile(null);
        setBackgroundImageUrl("");
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (err) {
      console.error("Error updating vendor profile:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handleAddtoCart = (productId, stock) => {
    console.log("Add to cart:", productId, stock);
  };

  // Custom Product Form Component
  const CustomProductForm = ({ sellerId, user }) => {
    const [formData, setFormData] = useState({
      productDescription: "",
      quantity: 1,
      specialRequirements: "",
      estimatedBudget: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to request custom products",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsSubmitting(true);
        const response = await apiClient.post(
          API_ENDPOINTS.SHOP.VENDOR.CUSTOM_PRODUCT(sellerId),
          {
            userId: user.id || user._id,
            userName: user.userName || "User",
            userEmail: user.email || "",
            productDescription: formData.productDescription,
            quantity: parseInt(formData.quantity) || 1,
            specialRequirements: formData.specialRequirements,
            estimatedBudget: formData.estimatedBudget
              ? parseFloat(formData.estimatedBudget)
              : null,
          }
        );

        if (response.data.success) {
          toast({
            title: "Success",
            description: "Your custom product request has been submitted!",
          });
          setFormData({
            productDescription: "",
            quantity: 1,
            specialRequirements: "",
            estimatedBudget: "",
          });
        }
      } catch (error) {
        console.error("Error submitting custom product request:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "Failed to submit custom product request",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="productDescription" className="text-gray-900 dark:text-white mb-2 block">
            Product Description *
          </Label>
          <Textarea
            id="productDescription"
            value={formData.productDescription}
            onChange={(e) =>
              setFormData({ ...formData, productDescription: e.target.value })
            }
            rows={4}
            required
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
            placeholder="Describe the custom product you'd like..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity" className="text-gray-900 dark:text-white mb-2 block">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="estimatedBudget" className="text-gray-900 dark:text-white mb-2 block">
              Estimated Budget ($)
            </Label>
            <Input
              id="estimatedBudget"
              type="number"
              min="0"
              step="0.01"
              value={formData.estimatedBudget}
              onChange={(e) =>
                setFormData({ ...formData, estimatedBudget: e.target.value })
              }
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="specialRequirements"
            className="text-gray-900 dark:text-white mb-2 block"
          >
            Special Requirements
          </Label>
          <Textarea
            id="specialRequirements"
            value={formData.specialRequirements}
            onChange={(e) =>
              setFormData({ ...formData, specialRequirements: e.target.value })
            }
            rows={3}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
            placeholder="Any specific requirements, materials, colors, sizes, etc..."
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !formData.productDescription.trim()}
          className="w-full bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] hover:opacity-90 text-white"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Submit Custom Product Request
            </>
          )}
        </Button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3785D8] mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-white">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error || "Vendor not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Background Image Section */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={
            backgroundImageUrl ||
            editFormData.backgroundImage ||
            vendor.backgroundImage ||
            "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1920&auto=format&fit=crop"
          }
          alt="Vendor background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        {isVendorOwner && (
          <div className="absolute top-4 right-4">
            {!isEditMode ? (
              <Button
                onClick={handleEditToggle}
                className="bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg"
                size="sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleEditToggle}
                  disabled={isSaving}
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-gray-900 border-white/30 shadow-lg"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={
                  profilePicUrl ||
                  editFormData.profilePic ||
                  vendor.profilePic ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
                }
                alt={vendor.storeName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-700 object-cover shadow-lg"
              />
            </div>

            {/* Vendor Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <div>
                    <Label htmlFor="storeName" className="text-gray-900 dark:text-white">
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      value={editFormData.storeName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          storeName: e.target.value,
                        })
                      }
                      className="mt-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
                      placeholder="Enter store name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-900 dark:text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                    {vendor.storeName}
                  </h1>
                  <p className="text-gray-700 dark:text-slate-300 mb-4">{vendor.description}</p>
                </>
              )}
              <div className="flex flex-wrap gap-2 text-sm mt-4">
                <span className="bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white px-3 py-1 rounded-full font-semibold">
                  {vendor.storeCategory}
                </span>
                <span className="bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-3 py-1 rounded-full">
                  {vendor.businessType}
                </span>
                {vendor.status === "approved" && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Sections (only in edit mode) */}
          {isEditMode && isVendorOwner && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-900 dark:text-white mb-2 block">Profile Picture</Label>
                <ProductImageUpload
                  imageFile={profilePicFile}
                  setImageFile={setProfilePicFile}
                  imageLoadingState={profilePicLoading}
                  uploadedImageUrl={profilePicUrl}
                  setUploadedImageUrl={setProfilePicUrl}
                  setImageLoadingState={setProfilePicLoading}
                  isEditMode={false}
                  isCustomStyling={false}
                />
                {!profilePicFile && editFormData.profilePic && (
                  <div className="mt-2">
                    <Label className="text-gray-700 dark:text-slate-300 text-sm">
                      Or enter image URL:
                    </Label>
                    <Input
                      type="url"
                      value={editFormData.profilePic}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          profilePic: e.target.value,
                        })
                      }
                      className="mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label className="text-gray-900 dark:text-white mb-2 block">Background Image</Label>
                <ProductImageUpload
                  imageFile={backgroundImageFile}
                  setImageFile={setBackgroundImageFile}
                  imageLoadingState={backgroundImageLoading}
                  uploadedImageUrl={backgroundImageUrl}
                  setUploadedImageUrl={setBackgroundImageUrl}
                  setImageLoadingState={setBackgroundImageLoading}
                  isEditMode={false}
                  isCustomStyling={false}
                />
                {!backgroundImageFile && editFormData.backgroundImage && (
                  <div className="mt-2">
                    <Label className="text-gray-700 dark:text-slate-300 text-sm">
                      Or enter image URL:
                    </Label>
                    <Input
                      type="url"
                      value={editFormData.backgroundImage}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          backgroundImage: e.target.value,
                        })
                      }
                      className="mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 flex gap-4 border-b border-slate-200 dark:border-slate-700">
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              onClick={() => setActiveTab("products")}
              className={`${
                activeTab === "products"
                  ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white"
                  : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Products ({products.length})
            </Button>
            <Button
              variant={activeTab === "reviews" ? "default" : "ghost"}
              onClick={() => setActiveTab("reviews")}
              className={`${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white"
                  : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Reviews ({reviews.length})
            </Button>
            {vendor.allowCustomProducts && (
              <Button
                variant={activeTab === "custom" ? "default" : "ghost"}
                onClick={() => setActiveTab("custom")}
                className={`${
                  activeTab === "custom"
                    ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white"
                    : "text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Request Custom Product
              </Button>
            )}
          </div>

          {/* Content Section */}
          <div className="mt-8">
            {activeTab === "products" ? (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-slate-400">No products available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                      const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
                      const originalPrice = product.salePrice > 0 ? product.price : null;
                      const rating = product.averageReview || 0;
                      
                      return (
                        <Card
                          key={product._id}
                          className="border-0 shadow-md hover:shadow-lg transition-all bg-white dark:bg-slate-800 rounded-2xl overflow-hidden group cursor-pointer"
                          onClick={() => handleGetProductDetails(product._id)}
                        >
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden">
                              <img
                                src={product.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop"}
                                alt={product.title}
                                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            <div className="p-6 flex flex-col items-center text-center space-y-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-gray-900 dark:text-white font-bold">
                                  ${displayPrice}
                                </p>
                                {originalPrice && (
                                  <p className="text-gray-500 dark:text-slate-400 line-through text-sm">
                                    ${originalPrice}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(rating)
                                        ? "fill-yellow-400"
                                        : "opacity-30"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 dark:text-slate-400 ml-1">
                                  {rating.toFixed(1)}
                                </span>
                              </div>

                              <Button
                                className="w-full mt-4 bg-gradient-to-r from-[#3785D8] to-[#BF8CE1] text-white hover:opacity-90 transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetProductDetails(product._id);
                                }}
                              >
                                Buy Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === "reviews" ? (
              <div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-slate-400">No reviews yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card
                        key={review._id}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {review.userName || "Anonymous"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-slate-400">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < review.reviewValue
                                      ? "text-yellow-400"
                                      : "text-gray-300 dark:text-slate-600"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-slate-300">{review.reviewMessage}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "custom" && vendor.allowCustomProducts ? (
              <div>
                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Request Custom Product
                    </h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-6">
                      Have something specific in mind? Request a customized product
                      tailored to your needs. Fill out the form below and we'll get back to you soon.
                    </p>
                    <CustomProductForm sellerId={sellerId} user={user} />
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default VendorProfilePage;
