import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const Profile = () => {
  const { currentUser, token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data.user;
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setAvatar(userData.avatar || "");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile picture to server
  const uploadProfilePicture = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await axios.put('/api/user/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setAvatar(response.data.avatarUrl);
      setSuccess("Profile picture updated successfully!");
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.put('/api/user/profile', 
        { name, phone },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-8 px-6 sm:px-10 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 sm:mt-0 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition disabled:opacity-70"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    setPreview("");
                    // Reset to original values
                    if (currentUser) {
                      setName(currentUser.name || "");
                      setPhone(currentUser.phone || "");
                    }
                  }}
                  className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 sm:p-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Profile Picture Section */}
            <motion.div variants={itemVariants} className="w-full lg:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-blue-400 text-6xl" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                    <FaCamera className="text-xl" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {isEditing && selectedFile && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <button
                    onClick={uploadProfilePicture}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {loading ? "Uploading..." : "Save Profile Picture"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview("");
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {!isEditing && (
                <h2 className="text-2xl font-bold text-blue-800 mt-4">{name}</h2>
              )}
            </motion.div>

            {/* Profile Details Section */}
            <motion.div variants={itemVariants} className="w-full lg:w-2/3 space-y-6">
              {/* Success/Error Messages */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-100 text-green-700 rounded-lg"
                >
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 text-red-700 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <FaUser className="text-blue-400" />
                    <span className="text-blue-800">{name}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-700">Email</label>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <FaEnvelope className="text-blue-400" />
                  <span className="text-blue-800">{email}</span>
                </div>
                {isEditing && (
                  <p className="text-xs text-blue-600 mt-1">
                    Note: Changing email may require verification.
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-blue-700">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                    placeholder="+91 1234567890"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <FaPhone className="text-blue-400" />
                    <span className="text-blue-800">{phone || "Not provided"}</span>
                  </div>
                )}
                {isEditing && (
                  <p className="text-xs text-blue-600 mt-1">
                    Note: Changing phone number may require verification.
                  </p>
                )}
              </div>

              {/* Additional Fields */}
              {!isEditing && currentUser && (
                <div className="pt-4 border-t border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Account Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600">Authentication Method</p>
                      <p className="font-medium text-blue-800">
                        {currentUser.authProvider === 'google' ? 'Google' : 'Email/Password'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;