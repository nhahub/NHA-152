import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/auth-page";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import BecomeSellerPage from "./pages/shopping-view/become-seller";
import BlogPage from "./pages/shopping-view/blog";
import ArticleViewPage from "./pages/shopping-view/article-view";
import WriteArticlePage from "./pages/admin-view/write-article";
import VendorProfilePage from "./pages/shopping-view/vendor-profile";
import ContactPage from "./pages/shopping-view/contact";
import CartPage from "./pages/shopping-view/cart-page";
import PaymentPage from "./pages/shopping-view/payment";
import Wishlist from "./components/wishlist/Wishlist";
import VendorsPage from "./pages/shopping-view/vendors";
import VendorLayout from "./components/vendor-view/layout";
import VendorDashboard from "./pages/vendor-view/dashboard";
import VendorProducts from "./pages/vendor-view/products";
import VendorOrders from "./pages/vendor-view/orders";
import VendorCustomRequests from "./pages/vendor-view/custom-requests";
import AdminVendors from "./pages/admin-view/vendors";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route index element={<ShoppingHome />} />
        </Route>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthPage />
            </CheckAuth>
          }
        />
        <Route
          path="/auth/login"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthPage />
            </CheckAuth>
          }
        />
        <Route
          path="/auth/register"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthPage />
            </CheckAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="write-article" element={<WriteArticlePage />} />
        </Route>
        <Route
          path="/vendor"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <VendorLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="custom-requests" element={<VendorCustomRequests />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<CartPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="become-seller" element={<BecomeSellerPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="article/:id" element={<ArticleViewPage />} />
          <Route path="vendor/:sellerId" element={<VendorProfilePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="vendors" element={<VendorsPage />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
