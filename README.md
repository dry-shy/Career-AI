🚀 CareerAI — AI-Powered Career & Interview Assistant

CareerAI is a full-stack AI-powered career development platform built using the MERN stack. It helps students and job seekers analyze their resumes, compare their skills with job requirements, prepare for technical interviews, and receive personalized career recommendations using Generative AI.

✨ Features
📄 AI Resume Analyzer — Analyze resumes and receive AI-generated feedback.
🎯 Job Description Analyzer — Extract required skills and qualifications from job descriptions.
📊 Resume–Job Matching — Compare candidate skills with job requirements and calculate a match score.
🤖 AI Interview Question Generator — Generate role-specific technical and HR interview questions.
🎤 AI Mock Interview — Practice interviews and receive AI-generated feedback.
💻 Coding Interview Preparation — Practice programming questions and analyze solutions.
📈 Interview Performance Tracking — Track interview scores and improvement over time.
🗺️ Personalized Learning Roadmap — Get a learning roadmap based on skill gaps.
🔐 JWT Authentication — Secure user registration and login.
📱 Responsive Dashboard — Manage resumes, interviews, skills, and career progress from one dashboard.
🛠️ Tech Stack
Frontend
React.js
JavaScript
React Router
Axios
Bootstrap / CSS
Backend
Node.js
Express.js
RESTful APIs
JWT Authentication
bcrypt
Database
MongoDB
Mongoose
AI
Google Gemini API / Generative AI
Tools
Git & GitHub
VS Code
Postman / Thunder Client
🏗️ Project Architecture
CareerAI
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/dry-shy/Career-AI.git
cd Career-AI
2. Install Frontend Dependencies
cd client
npm install
3. Install Backend Dependencies

Open another terminal:

cd server
npm install
🔑 Environment Variables

Create a .env file inside the server directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

⚠️ Never upload .env to GitHub.

Add this to .gitignore:

node_modules/
.env
.env.*
!.env.example
dist/
build/
*.log

You can provide a safe template as:

server/.env.example
PORT=5000
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
▶️ Running the Application
Start Backend
cd server
npm start

or:

npm run dev

Backend will run on:

http://localhost:5000
Start Frontend

Open another terminal:

cd client
npm start

Frontend will run on:

http://localhost:3000
🔌 API Overview
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Resume
POST /api/resume/upload
POST /api/resume/analyze
GET  /api/resume
GET  /api/resume/:id
Job Analysis
POST /api/jobs/analyze
POST /api/jobs/match
AI Interview
POST /api/interview/start
POST /api/interview/question
POST /api/interview/evaluate
GET  /api/interview/history
🤖 AI Workflow
                User
                  │
                  ▼
          CareerAI Frontend
                  │
                  ▼
          Express REST API
                  │
          ┌───────┴────────┐
          ▼                ▼
      MongoDB          AI Service
                           │
                           ▼
                    Gemini API
                           │
                           ▼
                    AI Response
                           │
                           ▼
                     Dashboard
📊 Example Workflow
Upload Resume
      ↓
AI Resume Analysis
      ↓
Extract Skills
      ↓
Enter Job Description
      ↓
Compare Skills
      ↓
Identify Skill Gaps
      ↓
Generate Interview Questions
      ↓
Take AI Mock Interview
      ↓
Receive Score & Feedback
      ↓
Get Personalized Learning Roadmap
🔐 Security

CareerAI implements:

JWT-based authentication
Password hashing
Protected API routes
Environment variables for API keys
Input validation
CORS configuration
Secure secret management
🚀 Future Enhancements
🔎 AI-powered job recommendations
📄 Automatic ATS resume optimization
🧠 RAG-based career assistant
💬 Real-time AI interview conversation
🎙️ Voice-based mock interviews
📊 Advanced interview analytics
☁️ Docker-based deployment
⚡ Redis caching
🔍 Vector database integration
🌐 Job portal API integration
🎯 Learning Outcomes

Through this project, I worked with:

Full-stack MERN development
REST API design
MongoDB data modeling
Authentication and authorization
Generative AI integration
Prompt engineering
API integration
Frontend–backend communication
Git & GitHub
Application architecture
👨‍💻 Author

Diwakar

Computer Science Engineering Student
Interested in Software Development, AI, MERN Stack, Backend Development & DSA

⭐ Support

If you find this project useful, consider giving the repository a ⭐ Star.
