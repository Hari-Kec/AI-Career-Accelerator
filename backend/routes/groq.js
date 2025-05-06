import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const allowedOrigins = [
  'http://localhost:5173',
  'https://careerbuilderai.netlify.app'
];

// Handle preflight OPTIONS request for CORS
router.options('/analyze', (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

router.post('/analyze', async (req, res) => {
  try {
    const { profile, languages, stats } = req.body;

    const prompt = `
You are an expert GitHub profile analyst. Create a detailed, visually appealing report with the following structure:

🌟 **GitHub Profile Analysis Report** 🌟

### 📌 **Profile Overview**
- **Bio**: "${profile.bio || 'Not provided'}"
- **Public Repos**: ${profile.public_repos} 📦
- **Followers**: ${profile.followers} 👥
- **Following**: ${profile.following} ↔️

### 📊 **Activity Metrics**
| Metric        | Count | Icon   | Assessment       |
|--------------|-------|--------|------------------|
| **Commits**  | ${stats.totalCommits} | 💾 | ${getCommitAssessment(stats.totalCommits)} |
| **PRs**      | ${stats.totalPRs} | 🔀 | ${getPRAssessment(stats.totalPRs)} |
| **Issues**   | ${stats.totalIssues} | 🐛 | ${getIssueAssessment(stats.totalIssues)} |

### 👨‍💻 **Technical Footprint**
**Top Languages**: 
${formatLanguages(languages).map(lang => `- ${lang.icon} ${lang.name} (${lang.percentage}%)`).join('\n')}

### 🏆 **Key Strengths**
${['✅ Consistent contributor', '✅ Strong documentation', '✅ Active in community'].map(strength => `- ${strength}`).join('\n')}

### 📈 **Growth Opportunities**
${['🌱 Expand to new technologies', '📣 Increase community engagement', '🔍 Improve issue response time'].map(opp => `- ${opp}`).join('\n')}

### 💡 **Recommendations**
${['✨ Add more project documentation', '🤝 Collaborate on open-source', '📊 Showcase projects in READMEs'].map(rec => `- ${rec}`).join('\n')}

**Formatting Rules**:
1. Use markdown formatting
2. Include relevant emojis
3. Highlight key metrics
4. Provide actionable insights
5. Keep tone professional but friendly
`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates beautifully formatted GitHub profile analysis reports with emojis, tables, and clear sections."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7
    });

    const reply = response.choices[0]?.message?.content || "No feedback generated.";
    res.json({ feedback: reply });
  } catch (error) {
    console.error('Groq Error:', error.message);
    res.status(500).json({ error: 'Groq API request failed' });
  }
});

export default router;
