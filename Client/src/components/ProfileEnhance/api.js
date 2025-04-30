import axios from 'axios';

const BASE_URL = 'https://api.github.com';
axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;

export const fetchProfile = (username) => 
  axios.get(`${BASE_URL}/users/${username}`);

export const fetchRepos = (username) => 
  axios.get(`${BASE_URL}/users/${username}/repos?per_page=100`);

export const fetchRepoLanguages = (username, repoName) => 
  axios.get(`${BASE_URL}/repos/${username}/${repoName}/languages`);

