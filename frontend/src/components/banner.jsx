import React from "react";

const Banner = ({ imageUrl, title, subtitle }) => {
  return (
    <div className="relative w-full h-[50vh] md:h-[70vh]">
      {/* Banner Image */}
      <img
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-cover"
      />

      {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white px-4">
  
        <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
    
        {subtitle && <p className="text-lg md:text-2xl">{subtitle}</p>}
      </div> */}
    </div>
  );
};

export default Banner;
