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

const Parsing = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

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
        }
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || "AI bot executed successfully!");
        console.log("Output:", data.output);
      } else {
        setStatus('error');
        setMessage(data.message || "Failed to run AI bot.");
        console.error("Error:", data.error || data.stderr);
      }
    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setMessage("Error while making the request to run the AI bot.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
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
                      Python Script Execution
                    </h3>
                    
                  </div>
                  <button
                    onClick={runAiBot}
                    disabled={status === 'loading'}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FiZap className={`text-xl ${status === 'loading' ? 'animate-pulse' : ''}`} />
                    <span className="text-lg font-semibold">
                      {status === 'loading' ? 'Processing...' : 'Run AI Bot'}
                    </span>
                  </button>
                </div>
              </div>

              {status !== 'idle' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl shadow-inner flex flex-col ${
                    status === 'loading' ? 'bg-yellow-50 border border-yellow-200' :
                    status === 'success' ? 'bg-green-50 border border-green-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        {status === 'loading' && <FiLoader className="text-3xl text-yellow-600 animate-spin" />}
                        {status === 'success' && <FiCheckCircle className="text-3xl text-green-600 animate-bounce" />}
                        {status === 'error' && <FiAlertCircle className="text-3xl text-red-600 animate-bounce" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">
                          {status === 'loading' ? 'Processing' :
                           status === 'success' ? 'Success!' :
                           'Error Occurred'}
                        </h4>
                        <p className="text-lg">{message}</p>
                      </div>
                    </div>

                    {status === 'loading' && (
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {status === 'success' && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex items-center gap-4">
                      <FiMessageCircle className="text-3xl text-blue-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-blue-800">Output Generated</h4>
                        <p className="text-blue-700">Check your console for detailed execution output.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <FiCode className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Python Script</h3>
                  <p className="text-gray-600">Executes the runAiBot.py file from your JobApplyBot directory</p>
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
    </div>
  );
};

export default Parsing;