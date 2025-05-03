import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import loginImage from "../../assets/login-image.png"; 
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Import Google icon

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signInWithGoogle } = useAuth(); // Add signInWithGoogle from context
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Add error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(''); // Clear previous errors
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-xl rounded-3xl overflow-hidden bg-white/30 backdrop-blur-md">
        
        {/* Left Side - Image */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center p-8 bg-white/40">
          <img 
            src={loginImage} 
            alt="Login illustration"
            className="w-full max-w-md transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-2">
              Welcome Back 🎓
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Sign in to continue your OffCampus Assist journey
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="mail@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="********"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 ease-in-out"
                >
                  Log in
                </button>
              </div>
            </form>

            {/* Google Sign-In Button */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/30 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <FaGoogle className="text-red-500" />
                  Log in with Google
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;