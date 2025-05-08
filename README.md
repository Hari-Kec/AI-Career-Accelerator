
# CareerbuildAi

> *An AI-driven platform to empower students in optimizing their professional profiles, discovering targeted job opportunities, and automating job applications.*

![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Tech Stack](https://img.shields.io/badge/techstack-React,%20Node.js,%20MongoDB-brightgreen)

## 📌 Project Overview

**CareerbuildAi** is an integrated solution designed specifically for college students aiming to excel in off-campus placements and enhance their career profiles. Powered by AI automation, it enables users to:

- ✅ Optimize resumes using ATS (Applicant Tracking System) analysis  
- ✅ Apply to **100+ jobs at once** via LinkedIn automation  
- ✅ Get personalized profile suggestions for GitHub & LinkedIn  
- ✅ Track application status seamlessly  

This tool streamlines the entire job hunting process — from building a strong resume to landing interviews.

---

## 🧩 Key Features

| Feature | Description |
|--------|-------------|
| 🔍 Resume ATS Checker & Optimizer | Analyze and improve your resume with AI-powered feedback |
| 🤖 One-click Bulk Job Application | Apply to 100+ jobs in one go using LinkedIn automation |
| 💼 Personalized Profile Advisor | Get tailored advice for GitHub and LinkedIn profiles |
| 📊 Application Tracker | Monitor your job applications, statuses, and follow-ups |
| 🔐 Secure Authentication | Firebase & MojoAuth-based secure login system |

---

## ⚙️ Tech Stack

### 🧑‍💻 Frontend
- React + Vite
- Tailwind CSS
- React Icons, React Hook Form, Zod Validator
- React Router DOM
- Axios for API calls

### 🧑‍🔧 Backend
- Node.js + Express
- MongoDB + Mongoose ORM
- Firebase Admin SDK (Authentication)
- Nodemailer, Crypto, JWT, Groq SDK

### 🤖 Job Automation Bot
- Python, Flask
- Selenium, PyAutoGUI, OpenAI SDK
- Undetected-Chromedriver, Webdriver Manager
- Requests, BeautifulSoup, Trio Websocket

### 📄 Resume Analyzer
- Streamlit UI
- Spacy, NLTK, Scikit-learn
- PDFMiner, PyPDF2, Docx2txt
- Google Generative AI, OpenRouter API

### ☁️ Hosting & Infrastructure
- AWS EC2 (Backend Server)
- Dockerized Deployment
- Ngrok for local tunneling
- Apache2 License

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB Atlas or Local Instance
- Firebase Project Setup
- AWS EC2 Access (Optional for deployment)

### Clone the Repository

```bash
git clone https://github.com/Hari-Kec/AI-Career-Accelerator.git
cd AI-Career-Accelerator
```

### 🧱 Frontend Setup

```bash
cd client
npm install vite@latest --save
npm run dev
```

### ⚙️ Backend Setup

```bash
cd backend
npm install bcryptjs@^3.0.2 body-parser@^2.2.0 cors@^2.8.5 crypto@^1.0.1 dotenv@^16.5.0 express@^5.1.0 express-validator@^7.2.1 firebase-admin@^13.3.0 groq-sdk@^0.20.1 jsonwebtoken@^9.0.2 mojoauth-sdk@^1.4.3 mojoauth-web-sdk@^1.17.19 mongodb@^6.16.0 mongoose@^8.14.0 multer@^1.4.5-lts.2 nodemailer@^6.10.1
node server.js
```

### 📝 Resume Analyzer Setup

```bash
cd models
pip install -r requirements.txt
python run_app.py
```

### 🤖 Job Apply Bot Setup

```bash
cd JobApplyBot
python app.py
```

---

## 📦 Docker Support

A Dockerfile is included for easy containerization. Use the following command to build and run:

```bash
docker build -t careerbuildai .
docker run -p 3000:3000 careerbuildai
```

---

## 📈 Roadmap

- [ ] Add support for more platforms like Indeed, Glassdoor
- [ ] Integrate AI Interview Coach
- [ ] Implement real-time tracking dashboard
- [ ] Enable smart filtering for job recommendations
- [ ] Add multi-language resume optimization

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) before submitting pull requests.

---

## 📜 License

This project is licensed under the [Apache License 2.0](LICENSE).

---

## 🎯 Want to Support?

If you find this project helpful, consider giving it a ⭐ or contributing to the development!

