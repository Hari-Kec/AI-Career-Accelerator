import React, { useState } from 'react';
import {
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiTerminal,
  FiMessageCircle,
  FiCpu,
  FiCode,
  FiDatabase
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
const Parsing = () => {
  const {authToken, user } = useAuth();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const runAiBot = async () => {
    
    setStatus('loading');
    setMessage('Initializing AI bot...');
    
    setProgress(10);

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 800);

    try {
      const res = await fetch("https://ff4a-103-218-133-171.ngrok-free.app/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          user_id: user.id // ✅ Dynamic user ID
        })
      });
      if (!res.ok) throw new Error("Failed to trigger bot");


      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || "AI bot executed successfully!");
        console.log("Output:", data.output);
      } else {
        setStatus('error');
        setMessage(data.message || "Running AI bot. Hold for some time . Dont refresh page");
        console.error("Error:", data.error || data.stderr);
      }
    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setMessage("Making the request to run the AI bot.");
      console.error(err);
    }
  };
  const handleApplyClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000); // Hide after 5s
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI Job Application Bot
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatically apply to hundreds of jobs with our AI-powered bot
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiCpu className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">AI Bot Controller</h2>
                <p className="text-gray-600">Run the automated job application process</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FiTerminal className="text-blue-600" />
                      Execution
                    </h3>
                  </div>
                  <button
                    onClick={handleApplyClick}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-green-300"
                  >
                    <FiZap className="text-xl" />
                    <span className="text-lg font-semibold">Start Applying to Jobs</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <FiCode className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Python Script</h3>
                  <p className="text-gray-600">Executes the Python file</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <FiDatabase className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Job Applications</h3>
                  <p className="text-gray-600">Automatically applies to 100+ jobs in one click</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <FiZap className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
                  <p className="text-gray-600">Optimized to complete applications quickly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Popup Notification */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 bg-white border border-green-300 rounded-xl shadow-2xl p-6 flex items-start gap-4 animate-fade-in-up z-50">
          <FiCheckCircle className="text-3xl text-green-600 mt-1 animate-bounce" />
          <div>
            <h4 className="text-lg font-bold text-green-800">Successfully Submitted!</h4>
            <p className="text-gray-700">
              You will be notified via email. Updates on job applications will be sent to your inbox.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parsing;