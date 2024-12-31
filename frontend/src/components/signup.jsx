import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { ToastContainer, toast } from "react-toastify";
import { BACKEND_URL } from "../config";
import { AuthContext } from '../utils/AuthContext';

function Signup({}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const navigate = useNavigate(); 
  const { isAuthenticated, login } = useContext(AuthContext); 
  console.log("isAuthenticated and login",isAuthenticated,login)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const validatePassword = () => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordPattern.test(password));
    setIsPasswordMatch(password === confirmPassword);
  };

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || !isPasswordMatch || !mobile || !name) {
      toast.error("Please ensure all fields are filled correctly.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/sendotp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      if (response.ok) {
        setOtpSent(true);
        toast.success("OTP sent successfully.");
      } else {
        const data = await response.json();
        toast.error(data?.message[0] || "OTP send failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email: "saaaaaa@gmail.com", // You might want to replace this with a dynamic email input.
          password,
          otp,
        }),
      });

      if (response.ok) {
        toast.success("Signed up successfully");
        navigate("/sign-in")
      } else {
        const data = await response.json();
        toast.error(
          data?.message[0] || "OTP verification failed. Please try again."
        );
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Sign up</h1>

        <form>
          {/* Username Input */}
          <div className="mb-4">
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent} // Disable username input once OTP is sent
            />
          </div>

          {/* Mobile Input */}
          <div className="mb-4">
            <PhoneInput
              id="mobile"
              placeholder="Enter phone number"
              value={mobile}
              onChange={setMobile}
              defaultCountry="IN"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              international
              disabled={otpSent} // Disable phone input once OTP is sent
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent} // Disable password input once OTP is sent
            />
            {!isPasswordValid && password && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 8 characters, contain one number and
                one uppercase letter.
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpSent} // Disable confirm password input once OTP is sent
            />
            {!isPasswordMatch && confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* OTP Section */}
          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className={`w-full h-12 ${
                isPasswordValid && isPasswordMatch && mobile && name
                  ? "bg-blue-500"
                  : "bg-gray-500 cursor-not-allowed"
              } text-white rounded-lg hover:bg-blue-600 focus:outline-none mb-4`}
              disabled={
                !isPasswordValid || !isPasswordMatch || !mobile || !name
              } // Disable button if password is invalid, not matching, phone is empty or username is empty
            >
              Send OTP
            </button>
          )}

          {otpSent && (
            <>
              {/* OTP Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mb-4"
              >
                Verify OTP
              </button>
            </>
          )}
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
