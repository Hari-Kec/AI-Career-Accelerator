import React, { useState } from 'react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // Logic to save settings (e.g., send to backend API)
    console.log('Settings saved:', {
      emailNotifications,
      darkMode,
    });
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Settings</h1>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-gray-800">Email Notifications</label>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="toggle-checkbox"
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium text-gray-800">Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="toggle-checkbox"
            />
          </div>

          {/* Change Password (UI only for now) */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">Change Password</label>
            <input
              type="password"
              placeholder="New password"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
