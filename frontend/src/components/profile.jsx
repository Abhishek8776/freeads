import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const UserProfile = () => {
  const [notificationPreference, setNotificationPreference] = useState(false);

  const user = {
    name: "Fayiz",
    email: "fayiz",
    mobile: "73373737373",
    bio: "Passionate developer and tech enthusiast",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in-down">
        <div className="flex items-start mb-6">
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-blue-200 hover:border-blue-300 transition-all duration-300"
          />
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600 mt-1">
              {user.bio.length > 100
                ? `${user.bio.substring(0, 97)}...`
                : user.bio}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={"py-2 px-4 border-b-2 border-blue-500 text-blue-500"}
            >
              Contact Info
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <p>{user.email}</p>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FaPhone className="inline mr-2" />
              Phone
            </label>
            <p>{user.mobile}</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-600">
              <FaWhatsapp className="inline mr-1" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
