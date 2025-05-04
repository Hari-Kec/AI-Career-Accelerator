import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiUpload, FiLinkedin, FiCalendar, FiUsers, FiType, FiDownload
} from 'react-icons/fi';

const LinkedInReport = () => {
  const location = useLocation();
  const [pdfFile, setPdfFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;


  useEffect(() => {
    if (location.state?.username && !linkedinUsername) {
      setLinkedinUsername(location.state.username);
    }
  }, [location, linkedinUsername]);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError('File size exceeds 20MB limit. Please use a smaller file.');
        return;
      }

      setPdfFile(file);
    }
  };

  const analyzePDF = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first');
      return;
    }
  
    setIsAnalyzing(true);
    setError(null);
  
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfFile);
      });
  
      const prompt = `
        Analyze this LinkedIn profile PDF and provide specific recommendations in JSON format with these keys:
        1. "headlineSuggestions": Array of 3 improved headline options
        2. "postingStrategy": Array of objects with "time" and "recommendation"
        3. "connectionTargeting": Array of specific professional types to connect with
        4. "summary": Brief overall assessment
        Return ONLY the raw JSON without any Markdown formatting or code blocks.
        Make recommendations specific and actionable.
      `;
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Data
                  }
                }
              ]
            }]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      let responseText = data.candidates[0]?.content?.parts[0]?.text || '';
  
      // Clean the response by removing Markdown code blocks if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json|```$/g, '').trim();
      }
  
      try {
        const parsed = JSON.parse(responseText);
        setAnalysisResults(parsed);
      } catch (e) {
        console.error('Invalid JSON:', responseText);
        throw new Error('Invalid JSON format from Gemini');
      }
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
      console.error('Full error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">LinkedIn Profile Analysis</h1>
          <p className="text-gray-600 mb-6">Upload your LinkedIn profile PDF to get personalized optimization suggestions.</p>

          <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center mb-3">
              <FiLinkedin className="text-xl text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                {linkedinUsername ? `LinkedIn.com/in/${linkedinUsername}` : 'Your LinkedIn Profile'}
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Don't know how to download your LinkedIn profile as PDF?{' '}
              <a
                href="https://www.linkedin.com/help/linkedin/answer/a541960"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <FiDownload className="inline mr-1" />
                Learn how to download your profile
              </a>
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Upload Profile PDF</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center">
                      <FiUpload className="text-lg text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {pdfFile ? pdfFile.name : 'Choose PDF file'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>

                <button
                  onClick={analyzePDF}
                  disabled={isAnalyzing || !pdfFile}
                  className={`px-4 py-3 rounded-lg flex items-center justify-center min-w-32 ${
                    !pdfFile || isAnalyzing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Now'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        {analysisResults && (
          <div className="space-y-6">
            {analysisResults.summary && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Summary</h2>
                <p className="text-gray-700">{analysisResults.summary}</p>
              </div>
            )}

            {analysisResults.headlineSuggestions && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <FiType className="text-xl text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Headline Optimization</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Your headline is the first thing people see. Here are some improved options:
                </p>
                <div className="space-y-3">
                  {analysisResults.headlineSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-800">Option {index + 1}:</p>
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResults.postingStrategy && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <FiCalendar className="text-xl text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Posting Strategy</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Optimal times to post based on your network and industry:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResults.postingStrategy.map((strategy, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-indigo-600">{strategy.time}</p>
                      <p className="text-gray-700">{strategy.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysisResults.connectionTargeting && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <FiUsers className="text-xl text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Connection Targeting</h2>
                </div>
                <p className="text-gray-600 mb-4">Suggested professionals to connect with:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {analysisResults.connectionTargeting.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInReport;
