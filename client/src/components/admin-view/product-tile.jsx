import { Button } from "../ui/button";
import { Star, Edit, Trash2 } from "lucide-react";
import { categoryOptionsMap } from "@/config";
import "@/styles/shop-listing.css";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const displayPrice = product?.salePrice > 0 ? product.salePrice : product?.price;
  const originalPrice = product?.salePrice > 0 ? product?.price : null;
  const rating = product?.averageReview || 0;
  const reviews = product?.reviews || product?.reviewsCount || 0;
  const categoryLabel = product?.category ? (categoryOptionsMap[product.category] || product.category) : null;

  return (
    <div className="shop-product-card border border-gray-300 dark:border-transparent p-4 rounded-lg dark:bg-[#1E293B] dark:text-white">
      <div className="shop-product-img-box relative">
        <img
          src={product?.image || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={product?.title}
          className="shop-product-img"
        />
      </div>

      <div>
        <h3 className="shop-product-name dark:text-white">
          {product?.title}
        </h3>
        {product?.sellerId && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Vendor: {product.sellerId.storeName || "N/A"}
          </p>
        )}
        <div className="shop-product-rating dark:text-gray-300">
          <Star className="shop-star-icon" fill="#f5c518" color="#f5c518" size={14} />
          {rating.toFixed(1)} <span className="dark:text-gray-400">({reviews})</span>
        </div>
        <div className="shop-product-price dark:text-white">
          ${displayPrice?.toFixed(2) || "0.00"}
          {originalPrice && (
            <span className="shop-original-price dark:text-gray-400"> ${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {categoryLabel && (
          <div className="shop-tag-container">
            <span className="shop-tag dark:bg-slate-700 dark:text-white">{categoryLabel}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
          className="flex-1 shop-add-btn"
          style={{ marginTop: 0 }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(product?._id)}
          variant="destructive"
          className="flex-1"
          style={{
            background: "#dc2626",
            marginTop: 0,
            padding: "10px 12px",
            borderRadius: "10px",
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default AdminProductTile;
