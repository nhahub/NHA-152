import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShopProductCard from "@/components/shopping-view/shop-product-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, filterOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import "@/styles/shop-listing.css";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { searchResults, isLoading: isSearchLoading } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [priceLimits, setPriceLimits] = useState([0, 0]);
  const PRODUCTS_PER_PAGE = 12;
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");
  const keywordParam = searchParams.get("keyword");
  const allowedFilterKeys = Object.keys(filterOptions);

  function sanitizeFilters(rawFilters = {}) {
    const sanitized = {};

    Object.entries(rawFilters).forEach(([key, value]) => {
      if (allowedFilterKeys.includes(key) && Array.isArray(value) && value.length) {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    // Check if user is logged in
    if (!user?.id) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    // Check if product is out of stock
    if (getTotalStock === 0) {
      toast({
        title: "Product is out of stock",
        variant: "destructive",
      });
      return;
    }

    // Check current cart items
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity available for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Add to cart
    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({
          title: "Product is added to cart",
        });
      } else {
        toast({
          title: "Error adding to cart",
          description: data?.payload?.message || "Failed to add product to cart",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    const sanitizedStoredFilters = sanitizeFilters(storedFilters);

    if (categorySearchParam) {
      sanitizedStoredFilters.category = [categorySearchParam];
    }

    setFilters(sanitizedStoredFilters);
    
    // Trigger search immediately if keyword is present on initial load
    if (keywordParam && keywordParam.trim()) {
      dispatch(getSearchResults(keywordParam.trim()));
    }
  }, [categorySearchParam, keywordParam, dispatch]);

  // Handle search keyword from URL
  useEffect(() => {
    if (keywordParam && keywordParam.trim()) {
      dispatch(getSearchResults(keywordParam.trim()));
    } else {
      dispatch(resetSearchResults());
    }
  }, [keywordParam, dispatch]);

  useEffect(() => {
    // Only update search params with filters if there's no keyword
    // If keyword exists, preserve it in the URL
    if (keywordParam) {
      // Keep keyword in URL, don't overwrite with filters
      return;
    }
    
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, keywordParam, setSearchParams]);

  useEffect(() => {
    // Only fetch filtered products if there's no search keyword
    if (filters !== null && sort !== null && !keywordParam) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
      setCurrentPage(1); // Reset to first page when filters/sort change
    }
  }, [dispatch, sort, filters, keywordParam]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    // Use search results if keyword is present, otherwise use product list
    const productsForPriceCalc = keywordParam && searchResults ? searchResults : productList;
    
    if (productsForPriceCalc && productsForPriceCalc.length > 0) {
      const prices = productsForPriceCalc
        .map((product) =>
          product?.salePrice > 0 ? product.salePrice : product?.price
        )
        .filter((price) => typeof price === "number" && !isNaN(price));

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setPriceLimits([minPrice, maxPrice]);

        setPriceRange((prevRange) => {
          if (prevRange[0] === 0 && prevRange[1] === 0) {
            return [minPrice, maxPrice];
          }

          const clampedMin = Math.max(minPrice, prevRange[0]);
          const clampedMax = Math.min(maxPrice, prevRange[1]);

          if (clampedMin > clampedMax) {
            return [minPrice, maxPrice];
          }

          return [clampedMin, clampedMax];
        });
      }
    } else {
      setPriceLimits([0, 0]);
      setPriceRange([0, 0]);
    }
  }, [productList, searchResults, keywordParam]);

  function handlePriceRangeChange(range) {
    setPriceRange(range);
    setCurrentPage(1);
  }

  // Use search results if keyword is present, otherwise use filtered product list
  const productsToDisplay = keywordParam 
    ? (searchResults || []) // Use search results when searching (even if empty array)
    : (productList || []);
  
  const filteredProducts = productsToDisplay.filter((product) => {
    const productPrice =
      product?.salePrice > 0 ? product.salePrice : product?.price;

    if (priceLimits[0] === priceLimits[1]) {
      return true;
    }

    return (
      productPrice >= priceRange[0] &&
      productPrice <= priceRange[1]
    );
  });

  return (
    <div className="min-h-screen bg-[#EAF2FB] dark:bg-[#0F172A]">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        priceRange={priceRange}
        priceLimits={priceLimits}
        onPriceRangeChange={handlePriceRangeChange}
      />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">
            {keywordParam ? `Search Results for "${keywordParam}"` : "All Products"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="shop-products-grid">
          {isSearchLoading && keywordParam ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <>
              {(() => {
                const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
                const safePage = Math.min(Math.max(1, currentPage), totalPages);
                const start = (safePage - 1) * PRODUCTS_PER_PAGE;
                const currentProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
                
                return (
                  <>
                    {currentProducts.map((productItem) => (
                      <ShopProductCard
                        key={productItem._id}
                        product={productItem}
                        onAdd={handleAddtoCart}
                        onViewDetails={handleGetProductDetails}
                      />
                    ))}
                    
                    {totalPages > 1 && (
                      <div className="shop-pagination" style={{ gridColumn: "1 / -1" }}>
                        <button
                          className="shop-nav-btn"
                          onClick={() => setCurrentPage((s) => Math.max(1, s - 1))}
                          disabled={safePage === 1}
                          aria-label="Previous page"
                        >
                          ‹ Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            className={`shop-page-btn ${safePage === i + 1 ? "active" : ""}`}
                            onClick={() => setCurrentPage(i + 1)}
                            aria-current={safePage === i + 1 ? "page" : undefined}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          className="shop-nav-btn"
                          onClick={() => setCurrentPage((s) => Math.min(totalPages, s + 1))}
                          disabled={safePage === totalPages}
                          aria-label="Next page"
                        >
                          Next ›
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      </div>
    </div>
  );
}

export default ShoppingListing;
