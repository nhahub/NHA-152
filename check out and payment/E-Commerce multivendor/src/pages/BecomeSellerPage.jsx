import React from "react";
import Hero from "../Components/auth/seller/Hero";
import HowTo from "../Components/auth/seller/HowTo";
import WhyUs from "../Components/auth/seller/WhyUs";
import WhyUsCard from "../Components/auth/seller/WhyUsCard";
import HowToCard from "../Components/auth/seller/HowToCard";
import HeroCard from "../Components/auth/seller/HeroCard"; // لو محتاجة
import RegisterForm from "../Components/auth/seller/BecomeSellerForm";


const BecomeSellerPage = () => {
  return (
    <div>
      <Hero /> 
    <WhyUs/>        {/* دا فوق */}
      <RegisterForm />     {/* الفورم/الكارد */}
      <HowTo />            {/* تحت الفورم */}   
    </div>
  );
};

export default BecomeSellerPage;
