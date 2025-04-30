import React, { useState } from 'react';
import { FiGithub, FiLinkedin, FiUser, FiAward, FiTrendingUp } from 'react-icons/fi';
import { FaRegLightbulb, FaLinkedin, FaGithub } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
const ProfileDashboard = () => {
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const analyzeProfile = () => {
    if (githubUsername) {
      navigate(`/github-report/${githubUsername}`);
    }
  };
  const openExternalProfile = (platform) => {
    const ghUser = githubUsername.trim();
    const liUser = linkedinUsername.trim();
  
    if (platform === 'github' && ghUser) {
      window.open(`https://github.com/${ghUser}`, '_blank');
    } else if (platform === 'linkedin' && liUser) {
      window.open(`https://linkedin.com/in/${liUser}`, '_blank');
    } else {
      console.warn('Missing or invalid username');
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white">
        <div className="p-6 border-b border-indigo-800">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <nav className="mt-4">
          <div className="px-6 py-3 bg-indigo-800 border-l-4 border-blue-400">
            <div className="flex items-center">
              <FiUser className="mr-3 text-blue-400" />
              <span className="font-medium">Profile Enhancement</span>
            </div>
          </div>
          {['Dashboard', 'Resume', 'Messages', 'Settings'].map((item, index) => (
            <div key={item} className="px-6 py-3 hover:bg-indigo-800 cursor-pointer text-indigo-200 hover:text-white">
              <div className="flex items-center">
                {index === 0 && <FiTrendingUp className="mr-3" />}
                {index === 1 && <FiAward className="mr-3" />}
                {index === 2 && <FiUser className="mr-3" />}
                {index === 3 && <FiGithub className="mr-3" />}
                <span>{item}</span>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Profile Enhancement</h1>
          <p className="text-gray-600">Optimize your professional profiles to attract better opportunities</p>
        </div>

        {/* Profile Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* GitHub Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaGithub className="text-2xl text-gray-800 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">GitHub Profile</h2>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">GitHub Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. yourusername"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>
            <button
              onClick={() => openExternalProfile('github')}
              disabled={!githubUsername}
              className={`flex items-center px-4 py-2 rounded-lg ${githubUsername ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <FiGithub className="mr-2" />
              View GitHub Profile
            </button>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaLinkedin className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">LinkedIn Profile</h2>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">LinkedIn Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. yourusername"
                value={linkedinUsername}
                onChange={(e) => setLinkedinUsername(e.target.value)}
              />
            </div>
            <button
              onClick={() => openExternalProfile('linkedin')}
              disabled={!linkedinUsername}
              className={`flex items-center px-4 py-2 rounded-lg ${linkedinUsername ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <FiLinkedin className="mr-2" />
              View LinkedIn Profile
            </button>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Analysis</h2>
            <button
              onClick={analyzeProfile}
              disabled={isAnalyzing || (!githubUsername && !linkedinUsername)}
              className={`px-4 py-2 rounded-lg flex items-center ${(!githubUsername && !linkedinUsername) || isAnalyzing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <FaRegLightbulb className="mr-2" />
                  Analyze Profile
                </>
              )}
            </button>
          </div>

          {suggestions.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Suggestions to improve your profile:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaRegLightbulb className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">Enter your GitHub and/or LinkedIn usernames and click "Analyze Profile" to get suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;