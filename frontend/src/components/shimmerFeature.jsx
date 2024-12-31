import React from "react";

function shimmerFeature() {
  return (
    <div
    
      className="relative w-[260px] bg-white rounded-sm border-2 border-yellow-500 shadow-md overflow-hidden"
    >
      {/* Star Icon */}
      <div className="absolute top-2 left-2 bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-md shadow-lg">
        <span className="material-icons text-yellow-500 text-sm">
          <svg
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </span>
      </div>

      {/* Image */}
      <img
        src="https://via.placeholder.com/260x190"
  
        className="w-full h-[190px] object-cover"
      />

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="inline-block w-5 h-2 bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-md mb-3">
        
        </span>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 w-6 h-2">
      
        </h3>

        {/* Place */}
        <div className="text-gray-600 text-sm flex items-center mb-1">
          <span className="material-icons text-gray-500 mr-1">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </span>
     
        </div>

        {/* Date */}
        <p className="text-gray-500 text-xs mb-2 w-4 h-2"></p>

        {/* Price */}
        <p className="text-lg font-semibold text-gray-800 w-2 h-1"></p>
      </div>

      {/* Underline */}
      <div className="border-t border-gray-300"></div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center text-white text-sm">
          <svg
            fill="gray"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
        </div>
        <div className="flex items-center text-white text-sm">
          <svg
            fill="gray"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default shimmerFeature;
