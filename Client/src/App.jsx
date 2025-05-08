import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
//LOGIN & REGISTER
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';

//MAIN DASHBOARD
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Dashboard/Profile';
import Settings from './components/Dashboard/Settings';
//PROFILE ENHANCE
import ProfileDashboard from './components/ProfileEnhance/Dashboard'
import GitHubReport from './components/ProfileEnhance/GithubReport';
import LinkedInReport from './components/ProfileEnhance/LinkedinReport';

//APPLY JOBS
import JobApply from './components/ApplyJob/JobApply';
import Parsing from './components/ApplyJob/Parsing';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/profile-enhance" element={<ProfileDashboard />} />
          <Route path="/github-report/:username" element={<GitHubReport />} />
          <Route path="/linkedin-report" element={<LinkedInReport />} />

          <Route path="/apply-jobs" element={<JobApply />} />
          <Route path="/parsing" element={<Parsing />} />
          

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
