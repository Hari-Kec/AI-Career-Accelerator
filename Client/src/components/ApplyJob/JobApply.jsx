import React, { useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiHome, 
  FiUpload, FiLock, FiGlobe, FiFlag, FiAward, FiX 
} from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const JobApply = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    ethnicity: '',
    gender: '',
    disability: '',
    veteran: '',
    linkedinEmail: '',
    linkedinPassword: '',
    resume: null
  });
  const token = localStorage.getItem('authToken');
  console.log('Sending request with token:', token);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'resume' && files && files[0]) {
      // Check file size (5MB limit)
      if (files[0].size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      setUploadedFileName(files[0].name);
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, resume: null }));
    setUploadedFileName(null);
  };
   

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.resume) {
      alert('Please upload your resume');
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      for (const [key, value] of Object.entries(formData)) {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      } 
      console.log('Sending request with token:', token);

      const response = await fetch('https://ai-career-accelerator.onrender.com/api/update-personal-py' ,{
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status); 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();
      alert(`Application submitted successfully!\n${result.message}`);
      navigate('/parsing'); 
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FiUser className="mr-2" /> Profile
          </h2>
          <p className="text-indigo-100 mt-1">Complete your profile to apply for jobs</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <FiUser className="mr-2 text-indigo-500" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <FiMapPin className="mr-2 text-indigo-500" /> Address Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHome className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Demographic Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <FiFlag className="mr-2 text-indigo-500" /> Demographic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity *</label>
                <select
                  name="ethnicity"
                  required
                  value={formData.ethnicity}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Hispanic/Latino">Hispanic/Latino</option>
                  <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                  <option value="Asian">Asian</option>
                  <option value="Black or African American">Black or African American</option>
                  <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                  <option value="White">White</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disability Status *</label>
                <select
                  name="disability"
                  required
                  value={formData.disability}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Veteran Status *</label>
              <select
                name="veteran"
                required
                value={formData.veteran}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* LinkedIn Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <FaLinkedin className="mr-2 text-indigo-500" /> LinkedIn Credentials
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="linkedinEmail"
                  required
                  value={formData.linkedinEmail}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="linkedinPassword"
                  required
                  value={formData.linkedinPassword}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <FiUpload className="mr-2 text-indigo-500" /> Resume Upload *
            </h3>
            
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                uploadedFileName 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <FiUpload className={`w-8 h-8 mb-3 ${
                    uploadedFileName ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  
                  {uploadedFileName ? (
                    <>
                      <p className="mb-1 text-sm font-medium text-gray-700 text-center truncate max-w-full">
                        {uploadedFileName}
                      </p>
                      <p className="text-xs text-green-600">
                        Ready to submit
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-gray-500 text-center">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max. 5MB)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  name="resume" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            
            {uploadedFileName && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formData.resume ? `${Math.round(formData.resume.size / 1024)} KB` : ''}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center"
                >
                  <FiX className="mr-1" /> Remove file
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <FiAward className="mr-2" /> Submit Application
                </>
              )}
            </button>
          </div>
          
          {/* Apply for Job Button */}
          {/* <div className="pt-4">
            <button
              type="button"
              onClick={() => navigate('/parsing')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              <FiAward className="mr-2" /> Apply for Job
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default JobApply;