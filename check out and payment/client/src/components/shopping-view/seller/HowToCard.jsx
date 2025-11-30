import React from 'react';

const HowToCard = (props) => {
  return (
    <div
      style={{ borderColor: "#1E0F75" }}
      className="py-12 px-5 w-64 bg-white rounded-2xl text-center flex flex-col gap-6 mx-auto hover:opacity-90 hover:border hover:-translate-y-1 transition-transform duration-300"
    >
      <div
        className="flex justify-center items-center rounded-full w-24 h-24 mx-auto mb-6 shadow-lg"
        style={{ background: "linear-gradient(135deg,#1E0F75,#3785D8)" }}
      >
        <span className="text-white text-7xl font-semibold tracking-wider leading-none">
          {props.icon}
        </span>
      </div>

      <h5 style={{ color: "#1E0F75" }} className="font-bold text-xl">
        {props.title}
      </h5>
      <p style={{ color: "#1E0F75" }} className="text-sm leading-relaxed">
        {props.content}
      </p>
    </div>
  );
};

export default HowToCard;

