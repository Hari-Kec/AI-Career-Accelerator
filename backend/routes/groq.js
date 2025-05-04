import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
router.options('/analyze', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});
router.post('/analyze', async (req, res) => {
  try {
    const { profile, languages, stats } = req.body;

    const prompt = `
You are an AI assistant reviewing a GitHub profile. Based on the following information, generate a personalized feedback summary with strengths and areas of improvement:

Bio: ${profile.bio}
Public Repositories: ${profile.public_repos}
Followers: ${profile.followers}
Top Languages: ${JSON.stringify(languages)}
Commits: ${stats.totalCommits}
PRs: ${stats.totalPRs}
Issues: ${stats.totalIssues}
`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const reply = response.choices[0]?.message?.content || "No feedback generated.";
    res.json({ feedback: reply });
  } catch (error) {
    console.error('Groq Error:', error.message);
    res.status(500).json({ error: 'Groq API request failed' });
  }
});

export default router;
