import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WhyUsCard = ({ icon, title, content }) => {
  return (
    <div className="py-12 px-6 rounded-2xl text-center flex flex-col gap-4 bg-[#1E0F75] border border-pink-200 hover:opacity-80 hover:-translate-y-2 transform transition ease-in-out duration-300">
      <div className="flex justify-center items-center rounded-full p-5 w-24 h-24 mx-auto bg-[#CBD8E8]">
        <FontAwesomeIcon icon={icon} className="text-5xl text-[#1E0F75]" />
      </div>
      <h5 className="font-bold text-lg text-white">{title}</h5>
      <p className="text-xs text-white">{content}</p>
    </div>
  );
};

export default WhyUsCard;

