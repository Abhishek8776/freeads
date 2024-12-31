import React, { useState, useEffect } from "react";
import CatagoryIcon from "../assets/images/category.jpg";
import ShimmerGrid from "./shimmerGrid";
import { BACKEND_URL } from "../config";
const CenteredGrid = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories/`) 
      .then((response) => response.json())
      .then((data) => {
        const categories = data.slice(0, 8).map((item) => ({
          name: item.name,
        }));
        setItems(categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ShimmerGrid/>
    );
  }

  return (
    <div className="flex items-center justify-center xl:h-[600px]">
      <div className="w-1/2 h-1/2 bg-white rounded-lg p-6 flex flex-col justify-center">
        <div className="grid  grid-cols-1 lg:grid-cols-4 gap-4 text-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 m-4 rounded-lg"
            >
              {/* Icon */}
              <img
                src={CatagoryIcon}
                alt="category icon"
                className="w-11 h-10"
              />
              {/* Title */}
              <p className="text-md font-medium text-gray-700">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CenteredGrid;
