import React from "react";
import LoginForm from "../Components/auth/LoginForm";
import RegisterForm from "../Components/auth/RegisterForm";


export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center gap-10 p-5 bg-[#C8D8E8] font-poppins">

      {/* Login Section */}
      <div className="flex-1 flex flex-col justify-center p-14 rounded-[20px]
        border-l-[10px] border-[#1E0F75] bg-gradient-to-br from-white to-[#f9f9f9]">
        <h2 className="text-[#1E0F75] text-2xl font-bold mb-7">Login</h2>
        <LoginForm />
      </div>

      {/* Register Section */}
      <div className="flex-1 flex flex-col justify-center p-14 rounded-[20px]
        border-l-[10px] border-[#3785D8] bg-gradient-to-br from-white to-[#f9f9f9]">
        <h2 className="text-[#1E0F75] text-2xl font-bold mb-7">Register</h2>
        <RegisterForm />
      </div>

    </div>
  );
}
