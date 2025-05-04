import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUser, FiMessageSquare, FiBarChart2, FiSettings } from 'react-icons/fi';
import { FaRegLightbulb, FaUserEdit, FaBriefcase } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data from AuthContext

  const handleResumeOptimizationClick = async () => {
    try {
      const response = await axios.get('/resume/run-resume-optimizer');
      if (response.data.status === 'success') {
        window.open('http://localhost:8501', '_blank');
      } else {
        alert(response.data.message || 'Failed to start optimizer');
      }
    } catch (error) {
      console.error('Error triggering resume optimizer:', error);
      alert('Failed to start resume optimizer. Please ensure the service is running.');
    }
  };

  const handleCardClick = (title) => {
    switch(title) {
      case 'Resume Optimization':
        handleResumeOptimizationClick();
        break;
      case 'Profile Enhancement':
        navigate('/profile-enhance');
        break;
      case 'Apply Jobs':
        navigate('/apply-jobs');
        break;
      default:
        break;
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Sidebar - Blue shade */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-xl"
      >
        <div className="p-6 border-b border-blue-700">
          <img src={logo} alt="Logo" className="h-30 w-75" />
        </div>
        <nav className="mt-4">
          <div className="px-6 py-3 bg-blue-700 border-l-4 border-blue-400">
            <div className="flex items-center">
              <FiHome className="mr-3 text-blue-300" />
              <span className="font-medium">Dashboard</span>
            </div>
          </div>
          
          {['Profile', 'Messages', 'Insights', 'Settings'].map((item, index) => {
            const icons = [FiUser, FiMessageSquare, FiBarChart2, FiSettings];
            const Icon = icons[index];
            return (
              <motion.div
                key={item}
                whileHover={{ scale: 1.02 }}
                className="px-6 py-3 hover:bg-blue-700 cursor-pointer text-blue-200 hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  <Icon className="mr-3" />
                  <span>{item}</span>
                </div>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-blue-900">
            Hi, Welcome back <span className="text-blue-600">{user?.name || 'User'}</span>!
          </h1>
          <p className="text-blue-600 mt-1">
            {user?.email ? `Logged in as ${user.email}` : ''}
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              title: "Resume Optimization", 
              icon: FaRegLightbulb, 
              bg: "bg-gradient-to-r from-blue-50 to-blue-100", 
              text: "text-blue-800",
              border: "border-blue-200"
            },
            { 
              title: "Profile Enhancement", 
              icon: FaUserEdit, 
              bg: "bg-gradient-to-r from-green-50 to-green-100", 
              text: "text-green-800",
              border: "border-green-200"
            },
            { 
              title: "Apply Jobs", 
              icon: FaBriefcase, 
              bg: "bg-gradient-to-r from-amber-50 to-amber-100", 
              text: "text-amber-800",
              border: "border-amber-200"
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-lg border ${item.border} ${item.bg} hover:shadow-lg transition-all cursor-pointer`}
                onClick={() => handleCardClick(item.title)}
              >
                <div className="flex items-center">
                  <Icon className={`text-2xl mr-4 ${item.text}`} />
                  <h3 className={`text-lg font-semibold ${item.text}`}>{item.title}</h3>
                </div>
                <p className={`mt-2 text-sm ${item.text} opacity-80`}>Click to get started</p>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Your Recent Activity</h2>
          <div className="text-gray-600">
            {user?.name ? (
              <p>Welcome to your personalized dashboard, {user.name.split(' ')[0]}! Start by optimizing your resume or updating your profile.</p>
            ) : (
              <p>No recent activity to show. Start by optimizing your resume or updating your profile!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;