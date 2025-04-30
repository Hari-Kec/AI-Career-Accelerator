import React from 'react';
import { FiHome, FiUser, FiMessageSquare, FiBarChart2, FiSettings } from 'react-icons/fi';
import { FaRegLightbulb, FaUserEdit, FaBriefcase } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import axios from 'axios';

const Dashboard = ({ name = "Hari" }) => {
  const handleResumeOptimizationClick = async () => {
    try {
      // Call your backend endpoint to trigger Streamlit
      await axios.get('http://localhost:5000/run-resume-optimizer');
      
      // Open the Streamlit app in a new tab (assuming it runs on port 8501)
      window.open('http://localhost:8501', '_blank');
      
    } catch (error) {
      console.error('Error triggering resume optimizer:', error);
      alert('Failed to start resume optimizer. Please ensure the backend service is running.');
    }
  };

  const handleCardClick = (title) => {
    switch(title) {
      case 'Resume Optimization':
        handleResumeOptimizationClick();
        break;
      case 'Profile Enhancement':
        // Add your profile enhancement logic here
        alert('Profile Enhancement feature coming soon!');
        break;
      case 'Apply Jobs':
        // Add your apply jobs logic here
        alert('Job Application feature coming soon!');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar - Blue shade from image */}
      <div className="w-64 bg-[#080a76] text-white">
        <div className="p-6 border-b border-[#2a4a7a]">
          <img src={logo} alt="Logo" className="h-30 w-75" />
        </div>
        
        <nav className="mt-4">
          <div className="px-6 py-3 bg-[#2a4a7a] border-l-4 border-[#4a8cff]">
            <div className="flex items-center">
              <FiHome className="mr-3 text-[#4a8cff]" />
              <span className="font-medium">Dashboard</span>
            </div>
          </div>
          
          {['Profile', 'Messages', 'Insights', 'Settings'].map((item, index) => {
            const icons = [FiUser, FiMessageSquare, FiBarChart2, FiSettings];
            const Icon = icons[index];
            return (
              <div key={item} className="px-6 py-3 hover:bg-[#2a4a7a] cursor-pointer text-[#a4b8d8] hover:text-white">
                <div className="flex items-center">
                  <Icon className="mr-3" />
                  <span>{item}</span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a3e72]">Hi, Welcome back {name}</h1>
        </div>

        {/* Action Cards - Matching image colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              title: "Resume Optimization", 
              icon: FaRegLightbulb, 
              bg: "bg-[#e3f2fd]", 
              text: "text-[#1976d2]",
              border: "border-[#bbdefb]"
            },
            { 
              title: "Profile Enhancement", 
              icon: FaUserEdit, 
              bg: "bg-[#e8f5e9]", 
              text: "text-[#388e3c]",
              border: "border-[#c8e6c9]"
            },
            { 
              title: "Apply Jobs", 
              icon: FaBriefcase, 
              bg: "bg-[#fff3e0]", 
              text: "text-[#ffa000]",
              border: "border-[#ffe0b2]"
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title} 
                className={`p-6 rounded-lg border ${item.border} ${item.bg} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleCardClick(item.title)}
              >
                <div className="flex items-center">
                  <Icon className={`text-2xl mr-4 ${item.text}`} />
                  <h3 className={`text-lg font-semibold ${item.text}`}>{item.title}</h3>
                </div>
                <p className={`mt-2 text-sm ${item.text} opacity-80`}>Click to get started</p>
              </div>
            );
          })}
        </div>

        {/* Additional Dashboard Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-[#1a3e72] mb-4">Your Recent Activity</h2>
          <div className="text-gray-600">
            <p>No recent activity to show. Start by optimizing your resume or updating your profile!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;