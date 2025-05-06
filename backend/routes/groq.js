import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const allowedOrigins = '*';

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

// Helper functions for assessments
function getCommitAssessment(commits) {
  if (commits > 1000) return "Highly active contributor 🚀";
  if (commits > 500) return "Very consistent activity 📈";
  if (commits > 100) return "Moderate contribution 💼";
  return "Needs more activity 📉";
}

function getPRAssessment(prs) {
  if (prs > 200) return "Top collaborator 👥";
  if (prs > 100) return "Frequent contributor 🔁";
  if (prs > 20) return "Occasional reviewer 📝";
  return "Few contributions 📊";
}

function getIssueAssessment(issues) {
  if (issues > 300) return "Active issue resolver 🛠️";
  if (issues > 100) return "Good community involvement 🤝";
  if (issues > 20) return "Fair participation 🧩";
  return "Minimal engagement 🕳️";
}

function formatLanguages(languages) {
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
  return Object.entries(languages)
    .map(([name, count]) => ({
      name,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      icon: getLanguageIcon(name),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}

function getLanguageIcon(langName) {
  const icons = {
    JavaScript: '🟨',
    TypeScript: '🟦',
    Python: '🟨',
    Java: '☕',
    C: '🧱',
    'C++': '🧱',
    'C#': '🧱',
    Go: '🟢',
    Rust: '🟦',
    PHP: '🟦',
    HTML: '🟥',
    CSS: '🟦',
    Shell: '🐧',
    Kotlin: '🔷',
    Swift: '🍎',
    Ruby: '🟥',
    SQL: '🛢️',
    Dart: '🟣',
    Scala: '🟣',
    R: '🟦',
    Perl: '🦪',
    Lua: '🌙',
    Other: '🧩'
  };
  return icons[langName] || '🧩';
}

router.post('/analyze', async (req, res) => {
  try {
    const { profile, languages, stats } = req.body;

    // Compute assessments
    const commitAssessment = getCommitAssessment(stats.totalCommits);
    const prAssessment = getPRAssessment(stats.totalPRs);
    const issueAssessment = getIssueAssessment(stats.totalIssues);

    // Format top languages
    const formattedLanguages = formatLanguages(languages);

    const prompt = `
🌟 **GitHub Profile Analysis Report** 🌟

### 📌 **Profile Overview**
- **Bio**: "${profile.bio || 'Not provided'}"
- **Public Repos**: ${profile.public_repos} 📦
- **Followers**: ${profile.followers} 👥
- **Following**: ${profile.following} ↔️

### 📊 **Activity Metrics**
| Metric        | Count | Icon   | Assessment       |
|--------------|-------|--------|------------------|
| **Commits**  | ${stats.totalCommits} | 💾 | ${commitAssessment} |
| **PRs**      | ${stats.totalPRs}     | 🔀 | ${prAssessment}     |
| **Issues**   | ${stats.totalIssues}  | 🐛 | ${issueAssessment}  |

### 👨‍💻 **Technical Footprint**
**Top Languages**: 
${formattedLanguages.map(lang => `- ${lang.icon} ${lang.name} (${lang.percentage}%)`).join('\n')}

### 🏆 **Key Strengths**
- ✅ Consistent contributor
- ✅ Strong documentation
- ✅ Active in community

### 📈 **Growth Opportunities**
- 🌱 Expand to new technologies
- 📣 Increase community engagement
- 🔍 Improve issue response time

### 💡 **Recommendations**
- ✨ Add more project documentation
- 🤝 Collaborate on open-source
- 📊 Showcase projects in READMEs

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