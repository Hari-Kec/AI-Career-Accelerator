import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProfile, fetchRepos, fetchRepoLanguages } from './api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import GitHubCalendar from 'react-github-calendar';
import axios from 'axios';

const GitHubReport = () => {
  const [feedback, setFeedback] = useState(null);
  const [generating, setGenerating] = useState(false);
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [topLanguages, setTopLanguages] = useState({});
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      try {
        const { data: user } = await fetchProfile(username);
        const { data: repoList } = await fetchRepos(username);

        setProfile(user);
        setRepos(repoList);

        const languageCount = {};
        let totalCommits = 0, totalPRs = 0, totalIssues = 0;

        for (const repo of repoList.slice(0, 5)) {
          const { data: langs } = await fetchRepoLanguages(username, repo.name);
          for (const [lang, val] of Object.entries(langs)) {
            languageCount[lang] = (languageCount[lang] || 0) + val;
          }
        }

        for (const repo of repoList.slice(0, 5)) {
          const commitsUrl = repo.commits_url.replace('{/sha}', '');
          const issuesUrl = repo.issues_url.replace('{/number}', '');

          try {
            const commitsRes = await axios.get(commitsUrl);
            totalCommits += commitsRes.data.length;

            const issuesRes = await axios.get(issuesUrl);
            totalIssues += issuesRes.data.length;
            totalPRs += issuesRes.data.filter(issue => issue.pull_request).length;
          } catch (error) {
            console.warn(`Skipping ${repo.name} stats due to API limits or error.`);
          }
        }

        setTopLanguages(languageCount);
        setSummaryStats({ totalCommits, totalPRs, totalIssues });
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [username]);
  const openExternalProfile = (platform) => {
    if (platform === 'github' && githubUsername) {
      window.open(`https://github.com/${githubUsername}`, '_blank');
    } else if (platform === 'linkedin' && linkedinUsername) {
      window.open(`https://linkedin.com/in/${linkedinUsername}`, '_blank');
    } else {
      console.error('Invalid platform or username not provided.');
    }
  };

  const generateFeedback = async () => {
    try {
      setGenerating(true);
      const res = await axios.post('http://localhost:5000/api/groq/analyze', {
        profile,
        languages: topLanguages,
        stats: summaryStats
      });
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error('Failed to generate feedback:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10 px-6 md:px-16">
      {loading ? (
        <p className="text-center text-xl font-medium text-gray-700">Analyzing GitHub profile...</p>
      ) : (
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-700 mb-2">GitHub Profile Report</h1>
            <p className="text-gray-600">An AI-powered breakdown of <span className="font-semibold text-indigo-600">{username}</span>'s GitHub activity</p>
          </div>

          {profile && (
            <div className="bg-white p-6 shadow-xl rounded-2xl flex flex-col md:flex-row items-center gap-6">
              <img src={profile.avatar_url} alt="avatar" className="w-28 h-28 rounded-full shadow-md border-4 border-indigo-200" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{profile.name || profile.login}</h2>
                <p className="text-gray-600 italic mt-1">{profile.bio}</p>
                <div className="mt-2 text-sm text-gray-500">📁 {profile.public_repos} Repositories • 👥 {profile.followers} Followers</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-indigo-700 mb-4">Contribution Calendar</h3>
              <GitHubCalendar username={username} blockSize={15} blockMargin={5} color="#6366F1" />
            </div>

            {summaryStats && (
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-indigo-700 mb-4">Contribution Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <h4 className="text-2xl font-bold text-indigo-600">{summaryStats.totalCommits}</h4>
                    <p className="text-gray-600">Commits</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-600">{summaryStats.totalPRs}</h4>
                    <p className="text-gray-600">Pull Requests</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-rose-600">{summaryStats.totalIssues}</h4>
                    <p className="text-gray-600">Issues</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Languages & Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">Top Languages Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {Object.entries(topLanguages).map(([lang, count]) => (
                  <li key={lang}>{lang}: {count} bytes</li>
                ))}
              </ul>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(topLanguages).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {Object.keys(topLanguages).map((_, index) => (
                      <Cell key={index} fill={`hsl(${index * 60}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Repos */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">Top Starred Repositories</h3>
            <ul className="space-y-4">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5)
                .map((repo) => (
                  <li key={repo.id} className="border-l-4 border-indigo-400 pl-4">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-indigo-600 text-lg font-semibold hover:underline">
                      {repo.name}
                    </a>
                    <p className="text-sm text-gray-600">{repo.description}</p>
                    <span className="text-xs text-gray-500">⭐ {repo.stargazers_count}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* AI Feedback */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-indigo-700">AI-Powered Profile Feedback</h3>
              <button
                onClick={generateFeedback}
                disabled={generating}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ease-in-out ${
                  generating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {generating ? 'Generating...' : 'Get AI Feedback'}
              </button>
            </div>
            {feedback && (
              <div className="text-gray-700 whitespace-pre-line border-t pt-4 border-gray-200">
                {feedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubReport;
