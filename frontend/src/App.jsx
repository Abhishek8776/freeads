import "./App.css";
import Home from "./components/home";
import SignUp from "./components/signup";
import SignIn from "./components/signin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdCreate from "./components/adCreateModal";
import UserProfile from "./components/profile";
import { AuthContext } from "./utils/AuthContext";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "./config"; // Make sure to import your backend URL here
import { toast } from "react-toastify";

function App() {
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
          setIsAuthenticated(data.loggedIn);
          setUsername(data.username); 
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, username }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/ad-create" element={<AdCreate />} />
            <Route path="/user-profile" element={<UserProfile />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
