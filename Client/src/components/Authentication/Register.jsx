import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import registerImage from "../../assets/register-image.png";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { register, signInWithGoogle } = useAuth(); // Add registerWithGoogle from context
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name, phone);
      navigate('/dashboard');
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration failed:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError("Google sign-up failed. Please try again.");
      console.error("Google sign-up failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-xl rounded-3xl overflow-hidden bg-white/30 backdrop-blur-md">
        <div className="md:w-1/2 hidden md:flex items-center justify-center p-8 bg-white/40">
          <img 
            src={registerImage} 
            alt="Register illustration"
            className="w-full max-w-md transition-all duration-500 hover:scale-105"
          />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-2">Create Account</h2>
            <p className="text-gray-600 text-center mb-8">Start your OffCampus Assist journey</p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Hari"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="name@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-300 ease-in-out"
                >
                  Sign up
                </button>
              </div>
            </form>

            {/* Google Sign-Up Button */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/30 text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignUp}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <FaGoogle className="text-red-500" />
                  Sign up with Google
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;