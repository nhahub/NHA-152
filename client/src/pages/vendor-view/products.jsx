import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { Plus } from "lucide-react";
import "@/styles/shop-listing.css";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function VendorProducts() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [productList, setProductList] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
          fetchProducts(seller._id);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
      setLoading(false);
    }
  };

  const fetchProducts = async (sellerId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.VENDOR.PRODUCTS.GET(sellerId)
      );
      if (response.data.success) {
        setProductList(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  function onSubmit(event) {
    event.preventDefault();

    if (!sellerInfo?._id) {
      toast({
        title: "Error",
        description: "Seller information not found",
        variant: "destructive",
      });
      return;
    }

    if (currentEditedId !== null) {
      apiClient
        .put(
          API_ENDPOINTS.VENDOR.PRODUCTS.EDIT(sellerInfo._id, currentEditedId),
          {
            ...formData,
            image: uploadedImageUrl || formData.image,
          }
        )
        .then((response) => {
          if (response.data.success) {
            fetchProducts(sellerInfo._id);
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setImageFile(null);
            setUploadedImageUrl("");
            toast({
              title: "Success",
              description: "Product updated successfully",
            });
          }
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          toast({
            title: "Error",
            description: "Failed to update product",
            variant: "destructive",
          });
        });
    } else {
      apiClient
        .post(API_ENDPOINTS.VENDOR.PRODUCTS.ADD(sellerInfo._id), {
          ...formData,
          image: uploadedImageUrl,
        })
        .then((response) => {
          if (response.data.success) {
            fetchProducts(sellerInfo._id);
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
            toast({
              title: "Success",
              description: "Product added successfully",
            });
          }
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to add product",
            variant: "destructive",
          });
        });
    }
  }

  function handleDelete(getCurrentProductId) {
    if (!sellerInfo?._id) return;

    apiClient
      .delete(
        API_ENDPOINTS.VENDOR.PRODUCTS.DELETE(sellerInfo._id, getCurrentProductId)
      )
      .then((response) => {
        if (response.data.success) {
          fetchProducts(sellerInfo._id);
          toast({
            title: "Success",
            description: "Product deleted successfully",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

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
          Your vendor account must be approved to manage products.
        </p>
        <Button onClick={() => navigate("/shop/home")}>
          Return to Shop
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products Management
        </h2>
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="shop-add-btn"
          style={{ width: "auto", marginTop: 0 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {productList && productList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No products yet. Add your first product!
          </p>
        </div>
      )}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default VendorProducts;
