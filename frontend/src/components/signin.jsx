import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css'; // Importing styles for the PhoneInput component
import PhoneInput from 'react-phone-number-input';
import { BACKEND_URL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../utils/AuthContext';

function Signin() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 
  const { isAuthenticated, login } = useContext(AuthContext); 
  console.log("isAuthenticated and login",isAuthenticated,login)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const isFormValid = () => {
    return mobile && password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, refresh_token } = data;

        // Store tokens securely (accessToken in localStorage and refreshToken in HttpOnly cookies)
        localStorage.setItem('accessToken', access_token);
        document.cookie = `refreshToken=${refresh_token}; path=/; HttpOnly; secure`; // Secure cookie for refresh token

        // Redirect to homepage (or desired page after login)
        toast.success('Login successful!');
        window.location.reload(); // Use navigate from react-router for redirection
      } else {
        const data = await response.json();
        toast.error(data?.message[0] || 'Login failed. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <div className="p-8 w-full max-w-sm border rounded-md shadow-lg">
        <h1 className="text-xl font-bold text-center mb-6">Sign in</h1>

        <form onSubmit={handleSubmit} method="POST">
          {/* Mobile Input */}
          <div className="mb-4">
            <PhoneInput
              id="mobile"
              placeholder="Enter phone number"
              value={mobile}
              onChange={setMobile}
              defaultCountry="IN" // Default country for the phone input
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              international
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              id="password"
              name="password"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <a href="#" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none ${
              loading ? 'bg-gray-500 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            New to FreeADS?{' '}
            <Link to="/sign-up" className="text-blue-500 hover:underline font-semibold">
              sign up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signin;
