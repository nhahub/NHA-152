import React from "react";
import WhyUsCard from "./WhyUsCard";
import {
  faHouse,
  faDollarSign,
  faEarthAmericas,
  faBullhorn,
  faLock,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

const WhyUs = () => {
  return (
    <div className="p-10 bg-[#ADC6E5]">
      <h2 style={{ color: "#1E0F75" }} className="text-3xl font-bold text-center mb-10">
        Why Sell With Us?
      </h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 rounded-2xl ">
        <WhyUsCard
          icon={faHouse}
          title="Easy Setup"
          content="Start selling in minutes with our simple onboarding process"
        />
        <WhyUsCard
          icon={faDollarSign}
          title="Fast Payments"
          content="Receive payments quickly and securely to your account"
        />
        <WhyUsCard
          icon={faEarthAmericas}
          title="Global Reach"
          content="Reach customers from all over the world"
        />
        <WhyUsCard
          icon={faBullhorn}
          title="Marketing Tools"
          content="Promote your store with built-in marketing features"
        />
        <WhyUsCard
          icon={faLock}
          title="Secure"
          content="Your data and transactions are protected with us"
        />
        <WhyUsCard
          icon={faHeadset}
          title="24/7 Support"
          content="Get help anytime from our dedicated support team"
        />
      </div>
    </div>
  );
};

export default WhyUs;

