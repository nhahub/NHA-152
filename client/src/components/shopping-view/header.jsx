import {
  Heart,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  UserCog,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useMemo, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import apiClient, { API_ENDPOINTS } from "@/config/api";
import { LayoutDashboard } from "lucide-react";

const shoppingViewHeaderMenuItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "products", label: "Products", path: "/shop/listing" },
  { id: "vendors", label: "Vendors", path: "/shop/vendors" },
  { id: "blog", label: "Blog", path: "/shop/blog" },
  { id: "contact", label: "Contact", path: "/shop/contact" },
];

function ShoppingHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVendor, setIsVendor] = useState(false);
  const [isCheckingVendor, setIsCheckingVendor] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
      checkVendorStatus();
    } else {
      setIsVendor(false);
    }
  }, [dispatch, user?.id]);

  const checkVendorStatus = async () => {
    if (!user?.id || user?.role === "admin") {
      setIsVendor(false);
      return;
    }

    try {
      setIsCheckingVendor(true);
      const response = await apiClient.get(
        API_ENDPOINTS.SHOP.SELLER + `/${user.id}`
      );
      if (response.data.success && response.data.data) {
        // Check if seller status is approved
        setIsVendor(response.data.data.status === "approved");
      } else {
        setIsVendor(false);
      }
    } catch (error) {
      // If 404, user is not a vendor
      if (error.response?.status === 404) {
        setIsVendor(false);
      } else {
        console.error("Error checking vendor status:", error);
        setIsVendor(false);
      }
    } finally {
      setIsCheckingVendor(false);
    }
  };

  const cartCount = useMemo(
    () => (cartItems?.items ? cartItems.items.length : 0),
    [cartItems?.items]
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    navigate(menuItem.path);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop/listing?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderNavLinks = () => (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-5">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer hover:text-primary-500 transition-colors relative group text-gray-700 dark:text-gray-200"
        >
          {menuItem.label}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Label>
      ))}
    </nav>
  );

  const renderAuthButtons = (variant = "desktop") => {
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-gradient-primary text-white cursor-pointer">
              {user?.profilePic && (
                <AvatarImage 
                  src={user.profilePic} 
                  alt={user?.userName || "User"} 
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-black/80 text-white font-semibold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-60">
            <DropdownMenuLabel className="font-semibold">
              Signed in as {user?.userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </DropdownMenuItem>
            {(user?.role === "admin" || isVendor) && (
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/vendor/dashboard"
                  )
                }
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
            )}
            {!isVendor && user?.role !== "admin" && (
              <DropdownMenuItem onClick={() => navigate("/shop/become-seller")}>
                <Sparkles className="mr-2 h-4 w-4" />
                Become a Seller
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div
        className={
          variant === "desktop"
            ? "flex items-center gap-3"
            : "flex flex-col gap-3 w-full"
        }
      >
        <Button
          variant="outline"
          className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
          onClick={() => navigate("/auth/login")}
        >
          Login
        </Button>
        <Button
          className="bg-gradient-primary text-white shadow-lg hover:opacity-90"
          onClick={() => navigate("/auth/register")}
        >
          Register
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm shadow-sm bg-white/95 text-gray-900 dark:bg-[#0f0f0f]/95 dark:text-white dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base uppercase tracking-wide text-text-900 dark:text-white">
              LuxMart
            </span>
            <span className="text-xs text-muted/80 dark:text-gray-400">
              Local Marketplace
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60 dark:text-gray-400" />
              <Input
                placeholder="Search for artisans, food, handmade items..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10 pr-4 py-2 border-0 bg-bg-200 text-gray-900 focus:bg-white dark:bg-[#1a1a1a] dark:text-white dark:placeholder-gray-400 dark:focus:bg-[#222]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs bg-white text-gray-900 dark:bg-[#0f0f0f] dark:text-white"
            >
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Search</h3>
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/70" />
                    <Input
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="pl-10 pr-4 py-2"
                    />
                  </div>
                </form>
              </div>
              {renderNavLinks()}
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    size="icon"
                    className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
                  >
                    <Moon className="w-5 h-5 dark:hidden" />
                    <Sun className="w-5 h-5 hidden dark:block" />
                  </Button>
                  <Button
                    onClick={() => setOpenCartSheet(true)}
                    variant="outline"
                    size="icon"
                    className="relative border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  </Button>
                </div>
                {renderAuthButtons("mobile")}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-end gap-6">
          {renderNavLinks()}
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
            >
              <Moon className="w-5 h-5 dark:hidden" />
              <Sun className="w-5 h-5 hidden dark:block" />
            </Button>

            <Button
              onClick={() => setOpenCartSheet(true)}
              variant="outline"
              size="icon"
              className="relative border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-[#6a00ff] dark:text-[#6a00ff] dark:hover:bg-[#6a00ff] dark:hover:text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>

            {renderAuthButtons()}
          </div>
        </div>
      </div>
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;
