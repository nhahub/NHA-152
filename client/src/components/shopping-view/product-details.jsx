import { Star, Package, ShieldCheck, Truck } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect } from "react";
import { getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] border-0 bg-transparent p-0 overflow-hidden flex flex-col">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex-1 min-h-0">
          <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 text-white min-h-[300px] lg:max-h-[90vh] overflow-hidden">
            <img
              src={
                productDetails?.image ||
                "https://images.unsplash.com/photo-1542751371-adc38448a05e"
              }
              alt={productDetails?.title}
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex flex-wrap gap-2">
                {productDetails?.category && (
                  <Badge className="bg-white/15 text-white border-white/20">
                    {productDetails.category}
                  </Badge>
                )}
                {productDetails?.brand && (
                  <Badge className="bg-white/15 text-white border-white/20">
                    {productDetails.brand}
                  </Badge>
                )}
                <Badge
                  className={`${
                    productDetails?.totalStock > 0
                      ? "bg-emerald-500/80"
                      : "bg-rose-500/80"
                  } text-white`}
                >
                  {productDetails?.totalStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-wide text-white/70">
                  Curated by Local Artisans
                </p>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {productDetails?.title}
                </h1>
                <p className="text-base md:text-lg text-white/85 line-clamp-4">
                  {productDetails?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-8 space-y-6 overflow-y-auto lg:max-h-[90vh]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  <span className="font-semibold">
                    {averageReview.toFixed(1)} / 5.0
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <p
                    className={`text-3xl font-bold ${
                      productDetails?.salePrice > 0
                        ? "text-muted-foreground line-through"
                        : "text-primary"
                    }`}
                  >
                    ${productDetails?.price}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-3xl font-semibold text-primary">
                      ${productDetails?.salePrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Fast local delivery</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>
                    {productDetails?.totalStock || 0} pieces ready to ship
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified artisan craftsmanship</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/10 border border-primary/10 p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Customize quantities, request personal touches, or add a note
                for the maker.
              </p>
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full h-12 text-base" disabled>
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full h-12 text-base bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Community Reviews</h2>
                <Badge variant="outline" className="text-xs">
                  {reviews?.length || 0} voices
                </Badge>
              </div>
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div
                    key={reviewItem._id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4 bg-slate-50/60 dark:bg-slate-800/40"
                  >
                    <Avatar className="w-10 h-10 border border-white shadow">
                      <AvatarFallback>
                        {reviewItem?.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">
                          {reviewItem?.userName || "Anonymous"}
                        </p>
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-2xl">
                  No reviews yet. Be the first to share your experience!
                </div>
              )}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
