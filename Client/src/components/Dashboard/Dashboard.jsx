import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiSettings
} from 'react-icons/fi';
import {
  FaRegLightbulb,
  FaUserEdit,
  FaBriefcase
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import Bgimg from '../../assets/resume.png';
import profile from '../../assets/profile.png';
import JobsBg from '../../assets/jobs.png';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleResumeOptimizationClick = () => {
    window.open('https://ai-career-accelerator-2.onrender.com', '_blank');
  };
  

  const handleCardClick = (title) => {
    switch (title) {
      case 'Resume Optimization':
        handleResumeOptimizationClick();
        break;
      case 'Profile Enhancement':
        navigate('/profile-enhance');
        break;
      case 'Apply Jobs':
        navigate('/parsing');
        break;
      default:
        break;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white-50 to-blue-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 text-white shadow-xl"
        style={{ backgroundColor: '#040646' }}
      >
        <div className="p-6 border-b border-blue-700">
          <img src={logo} alt="Logo" className="h-30 w-85" />
        </div>
        <nav className="mt-4">
          <div className="px-6 py-3 bg-blue-700 border-l-4 border-blue-400">
            <div className="flex items-center">
              <FiHome className="mr-3 text-blue-300" />
              <span className="font-medium">Dashboard</span>
            </div>
          </div>
          {['Profile', 'Settings'].map((item, index) => {
            const icons = [FiUser, FiSettings];
            const Icon = icons[index];
            const handleSidebarClick = () => {
              if (item === 'Profile') {
                navigate('/apply-jobs'); // Redirect "Profile" to Apply Jobs
              } else if (item === 'Settings') {
                navigate('/settings'); // You can change this path to wherever your settings route is
              }
            };
          
            return (
              <motion.div
                key={item}
                onClick={handleSidebarClick}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black-900">
            Hi, Welcome back{' '}
            <span className="text-#040646">{user?.name || 'User'}</span>!
          </h1>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 h-[65vh]">
          {[
            {
              title: 'Resume Optimization',
              icon: FaRegLightbulb,
              bg: 'bg-gradient-to-r from-green-50 to-green-100',
              text: 'text-black-800',
              border: 'border-black-200',
              bgImage: Bgimg
            },
            {
              title: 'Profile Enhancement',
              icon: FaUserEdit,
              bg: 'bg-gradient-to-r from-green-50 to-green-100',
              text: 'text-black-800',
              border: 'border-black-200',
              bgImage: profile
            },
            {
              title: 'Apply Jobs',
              icon: FaBriefcase,
              bg: 'bg-gradient-to-r from-amber-50 to-amber-100',
              text: 'text-black-800',
              border: 'border-black-200',
              bgImage: JobsBg
              
            }
          ].map((item, index) => {
            const Icon = item.icon;
            const isResume = item.title === 'Resume Optimization';

            return (
              <motion.div
                key={item.title}
                className="flex flex-col items-center"
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleCardClick(item.title)}
                  className={`w-full h-150 p-10 rounded-xl border ${item.border} ${item.bg}
                    hover:shadow-2xl transition-all cursor-pointer flex justify-center items-center min-h-[60%] relative`}
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay for Resume Optimization */}
                  {isResume && (
                    <div className="absolute inset-0 rounded-xl bg-black opacity-10"></div>
                  )}
                </motion.div>

                {/* Text Below Card */}
                <div className="flex flex-col items-center text-center mt-4">
                  <Icon className={`text-5xl ${item.text}`} />
                  <h3 className={`text-xl font-semibold ${item.text}`}>
                    {item.title}
                  </h3>
                  {/* <p className={`text-sm ${item.text}`}>
                    Click to get started with {item.title.toLowerCase()}.
                  </p> */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
