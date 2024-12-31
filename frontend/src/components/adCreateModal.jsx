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
  const navigate=useNavigate()

  const [formData, setFormData] = useState({
    caption: "",
    duration: "",
    category: "",
    cost: "",
    contact_details: "",
    subcategory: "",
    details: "",
    Country: "",
    State: "",
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
      Country: selectedCountryId,
      State: "",
    }));

    // Update subcategories based on the selected category
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
      console.log("accesstoken", accessToken);
  
      // Send the form data including image URLs (as array of objects with 'url' keys)
      const response = await fetch(`${BACKEND_URL}/api/ads/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData), // Form data now includes 'ads_images' with 'url' keys
      });
  
      console.log("response from the login", response);
  
      if (response.ok) {
        console.log("Ad creation response:", response);
        toast.success("Ad Created successfully.");
        navigate("/");
        toggleModal();
      } else {
        toast.error(response?.data?.message[0] || "Ad not created");
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
        src={image.url} // Access the 'url' key for the image
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

  // Handle form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Process form data here, e.g., send to API
  //   console.log("Form Submitted", formData);
  //   // Optionally close the modal after submission
  //   setModalOpen(false);
  // };

  return (
    <>
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center bg-gray-600 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
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

            {/* Modal Body */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Caption
                  </label>
                  <input
                    type="text"
                    name="caption"
                    id="caption"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Type Ad Caption"
                    value={formData.captiom}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="price"
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
                    placeholder="Duration"
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
                    value={formData.Country}
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
                    htmlFor="subcategory"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    name="State"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    value={formData.State}
                    onChange={handleChange}
                    required
                    disabled={!formData.Country}
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
                    className="block mb-2 text-sm font-medium text-gray-900 "
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
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
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Ad details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write Ad details here"
                    value={formData.details}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="contact_details"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Contact Details
                  </label>
                  <textarea
                    id="contact_details"
                    name="contact_details"
                    rows="5"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write Ad contact details here"
                    value={formData.contact_details}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Multiple Image Upload */}
                <div className="col-span-2">
                  <label
                    htmlFor="images"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Upload Images
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="ads_images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                  />
                  <div className="flex mt-2">{previewImages}</div>
                </div>
              </div>

              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add new ad
              </button>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default AdCreateModal;
