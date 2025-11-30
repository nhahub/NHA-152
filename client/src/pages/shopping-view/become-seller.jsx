import React from "react";
import Hero from "@/components/shopping-view/seller/Hero";
import WhyUs from "@/components/shopping-view/seller/WhyUs";
import BecomeSellerForm from "@/components/shopping-view/seller/BecomeSellerForm";
import HowTo from "@/components/shopping-view/seller/HowTo";

const BecomeSellerPage = () => {
  return (
    <div>
      <Hero />
      <WhyUs />
      <BecomeSellerForm />
      <HowTo />
    </div>
  );
};

export default BecomeSellerPage;

