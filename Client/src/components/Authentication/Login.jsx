import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import loginImage from "../../assets/login-image.png"; 
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await login(email, password); // This comes from backend
      const token = response?.token; // Make sure `login` returns token
      if (token) localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetStatus(null);
    setIsResetting(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus('success');
      setResetEmail('');
      setTimeout(() => {
        setShowResetModal(false);
        setResetStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setResetStatus('error');
    } finally {
      setIsResetting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Main Login Form */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row max-w-5xl w-full shadow-2xl rounded-3xl overflow-hidden bg-white"
      >
        {/* Left Side - Image */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center p-8 bg-gradient-to-b from-black-600 to-blue-500">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <img 
              src={loginImage} 
              alt="Login illustration"
              className="w-full max-w-md drop-shadow-lg"
            />
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-blue-800 text-center mb-2">
                Welcome Back <span className="text-blue-600">🎓</span>
              </h2>
              <p className="text-blue-800 text-center mb-8 text-xl">
                Continue your OffCampus Assist journey
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-md font-medium text-blue-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-blue-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                    placeholder="mail@gmail.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-md font-medium text-blue-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center text-sm text-blue-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-800 focus:ring-blue-500 border-blue-300 rounded mr-2"
                  />
                  Remember me
                </label>
                <button 
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-xl shadow-md transition-all duration-300 ease-in-out flex items-center justify-center ${
                    isLoading ? 'opacity-80' : ''
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Log in <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>

            {/* Google Sign-In Button */}
            <motion.div variants={containerVariants} className="mt-6">
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200"></div>
                </div>
                <div className="relative flex justify-center text-md">
                  <span className="px-2 bg-white text-blue-500">Or continue with</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl shadow-sm text-md font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <FaGoogle className="text-red-500" />
                  Log in with Google
                </button>
              </motion.div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-md text-blue-600 mt-6">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-700 font-medium hover:underline">
                Sign up
              </a>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-blue-100"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Reset Password</h3>
              
              {resetStatus === 'success' ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-green-100 text-green-700 rounded-lg mb-4 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Password reset email sent! Check your inbox.
                </motion.div>
              ) : (
                <>
                  <p className="mb-4 text-blue-600">Enter your email address to receive a password reset link.</p>
                  <form onSubmit={handlePasswordReset}>
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-blue-400" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                        placeholder="Your email address"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetModal(false);
                          setResetStatus(null);
                        }}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isResetting}
                        className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition flex items-center ${
                          isResetting ? 'opacity-80' : ''
                        }`}
                      >
                        {isResetting ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {isResetting ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {resetStatus === 'error' && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-3 bg-red-100 text-red-700 rounded-lg mt-4 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Error sending reset email. Please check the email address and try again.
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;