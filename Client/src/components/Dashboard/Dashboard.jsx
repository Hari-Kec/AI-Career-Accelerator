import React from 'react';
import { FiHome, FiUser, FiMessageSquare, FiBarChart2, FiSettings } from 'react-icons/fi';
import { FaRegLightbulb, FaUserEdit, FaBriefcase } from 'react-icons/fa';

const Dashboard = ({ name = "Jessica Grande" }) => {
  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* Sidebar - Blue shade from image */}
      <div className="w-64 bg-[#080a76] text-white">
        <div className="p-6 border-b border-[#2a4a7a]">
          
          <p className="text-lg text-[#a4b8d8]">Web logo</p>
          <h1 className="text-2xl font-bold">Shaw</h1>
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
          <p className="text-[#6c757d]">Monday, January 31, 2022</p>
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
              <div key={item.title} className={`p-6 rounded-lg border ${item.border} ${item.bg} hover:shadow-md transition-shadow cursor-pointer`}>
                <div className="flex items-center">
                  <Icon className={`text-2xl mr-4 ${item.text}`} />
                  <h3 className={`text-lg font-semibold ${item.text}`}>{item.title}</h3>
                </div>
                <p className={`mt-2 text-sm ${item.text} opacity-80`}>Click to get started</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-[#e0e0e0]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1a3e72]">Hours Spent</h2>
            <span className="text-sm text-[#6c757d]">Last 7 days</span>
          </div>
          <div className="flex justify-between text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex flex-col items-center">
                <div className="h-24 w-8 bg-[#e3f2fd] rounded-t-md mb-2"></div>
                <span className="text-xs text-[#6c757d]">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-[#6c757d]">Total: <span className="font-semibold text-[#1a3e72]">20.15m</span></p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#e0e0e0]">
            <h2 className="text-xl font-semibold mb-4 text-[#1a3e72]">Your Courses</h2>
            {[
              { title: "Copywriting for User Experience Design", instructor: "Mohamed Lewis", duration: "20.21m", code: "A.1669" },
              { title: "The 5 Steps to Presenting Like a Pro", instructor: "Fernandez Diaz", duration: "30.25m", code: "A.857" },
              { title: "Conducting UX Research: Steps to...", instructor: "Susanne Potzky" }
            ].map((course) => (
              <div key={course.title} className="mb-4 pb-4 border-b border-[#f5f5f5] last:border-0">
                <h3 className="font-medium text-[#333]">{course.title}</h3>
                <p className="text-sm text-[#6c757d]">{course.instructor}</p>
                {course.duration && (
                  <div className="flex text-xs text-[#9e9e9e] mt-1">
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{course.code}</span>
                  </div>
                )}
              </div>
            ))}
            <button className="text-[#1976d2] text-sm font-medium mt-2">Show All</button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#e0e0e0]">
            <h2 className="text-xl font-semibold mb-4 text-[#1a3e72]">Assignments</h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 text-[#6c757d]">
                <span>To Start</span>
                <span>In Progress</span>
                <span>Finished</span>
              </div>
              <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                <div className="h-full bg-[#1976d2]" style={{ width: '30%' }}></div>
                <div className="h-full bg-[#ffc107]" style={{ width: '50%' }}></div>
                <div className="h-full bg-[#4caf50]" style={{ width: '20%' }}></div>
              </div>
            </div>
            {[
              { title: "Simple Copywriting", due: "Due in 3 days" },
              { title: "Presentation Task", due: "Due in 3 days" }
            ].map((task) => (
              <div key={task.title} className="mb-3">
                <h3 className="font-medium text-[#333]">{task.title}</h3>
                <p className="text-sm text-[#6c757d]">{task.due}</p>
              </div>
            ))}
            <button className="text-[#1976d2] text-sm font-medium mt-2">See All Assignments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;