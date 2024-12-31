import { useContext, useEffect, useState } from "react";
import logo from "../assets/images/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import AdCreateModal from "./AdCreateModal";
import { BACKEND_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";


function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const navigate = useNavigate();
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null); // Optional: store the username
  
  // Check authentication on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/isloggedin/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data?.loggedIn);
          setUsername(data?.username); 
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, [],[isAuthenticated]);



  const handleButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    } else {
      toggleModal();
    }
  };
  const handleLogOut = async () => {
    try {
      // Make the logout request to the backend
      const response = await fetch(`${BACKEND_URL}/api/logout/`, {
        method: "POST", // assuming a GET request for logout
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the access token if needed
        },
      });

      if (response.ok) {
        // On successful logout, clear tokens and update the state
        localStorage.removeItem("accessToken");
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Expire the refresh token cookie
        toast.success("Logged out successfully!");
        setIsAuthenticated(false)
        window.location.reload(); // Optionally redirect to home page or sign-in page
      } else {
        // Handle errors from the server
        const data = await response.json();
        toast.error(data?.message || "Logout failed, please try again");
      }
    } catch (error) {
      // Handle any network or unexpected errors
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <header className="flex flex-row items-center justify-between mx-20 my-3 p-2 bg-white">
        <div>
          <img src={logo} alt="Logo" className="w-60 h-12" />
        </div>

        <nav className="hidden sm:flex justify-between items-center gap-4 mt-5">
          <Link to="/" className="hover:text-gray-500 text-black self-center">
            HOME
          </Link>
          <button
            type="button"
            className="text-white bg-[#f32525] hover:bg-red-400 focus:ring-4 focus:outline-none focus:bg-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
            onClick={handleButtonClick}
          >
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            ADD LISTING
          </button>
          {isAuthenticated && (
            <Link to="/user-profile">
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </Link>
          )}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogOut}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
            >
              Log Out
            </button>
          )}

          {!isAuthenticated && (
            <div className="flex items-center justify-center">
              <div className="border w-fit rounded-xl m-5 shadow-sm">
                <Link to="/sign-in">
                  <button className="px-4 py-2 rounded-l-xl text-white m-0 bg-[#2558da] hover:bg-blue-600 transition">
                    Login
                  </button>
                </Link>
                <Link to="/sign-up">
                  <button className="px-4 py-2 rounded-r-xl bg-gray-50 hover:bg-gray-100 transition">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Modal Component */}
      {showModal && (
        <AdCreateModal
          showModal={showModal}
          setShowModal={setShowModal} // Pass the setter function to close the modal
        />
      )}
      <ToastContainer/>
    </>
  );
}

export default Header;
