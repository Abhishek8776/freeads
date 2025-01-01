import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import axios from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
// import { Storage } from "aws-amplify";
import awsconfig from "../awsconfig";

// Storage.configure(awsconfig);

const AdCreateModal = (props) => {
  console.log("props", props);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caption: "",
    duration: "",
    category: "",
    cost: "",
    contact_details: "",
    subcategory: "",
    details: "",
    country: "", // Fixed the capitalization issue here
    state: "", // Fixed the capitalization issue here
    ads_images: [],
  });

  useEffect(() => {
    // Fetch countries
    fetch(`${BACKEND_URL}/api/countries/`) // Assuming /countries endpoint
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
        setStates(data[0]?.states || []);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Handle country change
  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;
    const selectedCoutryData = countries.find(
      (country) => country.id.toString() === selectedCountryId
    );

    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountryId, // Corrected the key name here
      state: "", // Reset state when country changes
    }));

    // Update states based on the selected country
    setStates(selectedCoutryData ? selectedCoutryData.states : []);
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories/`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data); // Store categories in state
        setSubcategories(data[0]?.subcategories || []); // Set subcategories for the first category as default
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken", accessToken);

      // Send the form data including image URLs (as an array of objects with 'url' keys)
      const response = await fetch(`${BACKEND_URL}/api/ads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData), // Form data now includes 'ads_images' with 'url' keys
      });

      if (response.ok) {
        const result = await response.json(); // Get the response data
        console.log("Ad creation response:", result);
        toast.success("Ad Created successfully.");
        navigate("/");
        toggleModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || "Ad not created");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const toggleModal = () => {
    props?.setShowModal(!props?.showModal);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = [];

    for (const file of files) {
      try {
        // Upload the file directly to S3 using AWS Amplify
        const result = await Storage.put(file.name, file, {
          contentType: file.type, // specify the file type
        });

        // Get the file URL after the upload
        const fileUrl = await Storage.get(result.key);
        imageUrls.push(fileUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      }
    }

    // Update the form data with the uploaded image URLs
    setFormData((prevData) => ({
      ...prevData,
      ads_images: imageUrls,
    }));
  };

  // Preview images before submit
  const previewImages = formData.ads_images.map((image, index) => (
    <div key={index} className="w-20 h-20 mr-2">
      <img
        src={image} // Directly use the image URL (not image.url)
        alt={`preview-${index}`}
        className="object-cover w-full h-full rounded"
      />
    </div>
  ));

  // Handle category change and update subcategories
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategoryData = categories.find(
      (category) => category.id.toString() === selectedCategoryId
    );

    setFormData((prevData) => ({
      ...prevData,
      category: selectedCategoryId, // Store the category id
      subcategory: "", // Reset subcategory when category changes
    }));

    // Update subcategories based on the selected category
    setSubcategories(
      selectedCategoryData ? selectedCategoryData.subcategories : []
    );
  };

  return (
    <>
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center bg-gray-600 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Ad
              </h3>
              <button
                onClick={toggleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="caption"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Caption
                  </label>
                  <input
                    type="text"
                    name="caption"
                    id="caption"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type Ad Caption"
                    value={formData.caption} // Fixed typo here
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="duration"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Duration
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="cost"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    id="cost"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={formData.country}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    name="state" // Fixed the capitalization here
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={formData.state} // Fixed the capitalization here
                    onChange={handleChange}
                    required
                    disabled={!formData.country}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="subcategory"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Sub Category
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={formData.subcategory}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Select subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="details"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Ad Details
                  </label>
                  <textarea
                    name="details"
                    id="details"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Write Ad details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Upload Images
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="flex mt-2">{previewImages}</div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdCreateModal;
