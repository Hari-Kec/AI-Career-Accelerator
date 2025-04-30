import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
//LOGIN & REGISTER
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';

//MAIN DASHBOARD
import Dashboard from './components/Dashboard/Dashboard';

//PROFILE ENHANCE
import ProfileDashboard from './components/ProfileEnhance/Dashboard'
import GitHubReport from './components/ProfileEnhance/GithubReport';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile-enhance" element={<ProfileDashboard />} />
          <Route path="/github-report/:username" element={<GitHubReport />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
