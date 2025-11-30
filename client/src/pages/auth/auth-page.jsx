import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ShoppingHeader from "@/components/shopping-view/header";
import ShoppingFooter from "@/components/shopping-view/footer";

export default function AuthPage() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/login");
  const isRegisterPage = location.pathname.includes("/register");
  const showBoth = !isLoginPage && !isRegisterPage; // Show both if on /auth

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <ShoppingHeader />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-[#EAF2FB] dark:bg-slate-900 py-10 px-5">
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 w-full max-w-6xl">
          {/* Login Section */}
          <div
            className={`flex flex-col justify-center p-14 rounded-[20px]
            border-l-[10px] border-[#1E0F75] bg-gradient-to-br from-white to-[#f9f9f9] dark:from-slate-800 dark:to-slate-900
            ${showBoth ? "flex-1 max-w-xl" : "w-full max-w-xl"}`}
            style={{ display: showBoth || isLoginPage ? "flex" : "none" }}
          >
            <h2 className="text-[#1E0F75] dark:text-white text-2xl font-bold mb-7">
              Login
            </h2>
            <LoginForm />
          </div>

          {/* Register Section */}
          <div
            className={`flex flex-col justify-center p-14 rounded-[20px]
            border-l-[10px] border-[#3785D8] bg-gradient-to-br from-white to-[#f9f9f9] dark:from-slate-800 dark:to-slate-900
            ${showBoth ? "flex-1 max-w-xl" : "w-full max-w-xl"}`}
            style={{ display: showBoth || isRegisterPage ? "flex" : "none" }}
          >
            <h2 className="text-[#1E0F75] dark:text-white text-2xl font-bold mb-7">
              Register
            </h2>
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <ShoppingFooter />
    </div>
  );
}
