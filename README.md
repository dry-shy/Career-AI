# 🚀 CareerAI — AI-Powered Career & Interview Assistant

> An AI-powered career assistant that helps students and job seekers prepare for interviews, improve their resumes, practice technical questions, and get personalized career guidance.

---

## 🌟 Overview

**CareerAI** is an AI-powered career and interview assistant designed to help developers and job seekers prepare for their careers.

The platform combines **AI, modern web technologies, and personalized career tools** to provide an interactive experience for interview preparation and career development.

With CareerAI, users can:

* 🤖 Ask AI career-related questions
* 💼 Prepare for technical and HR interviews
* 🧠 Generate interview questions and answers
* 📄 Get resume improvement suggestions
* 💻 Practice programming and technical questions
* 🎯 Receive personalized career guidance
* 📊 Track interview preparation progress
* 🔐 Create an account and manage their profile

---

## ✨ Features

### 🤖 AI Career Assistant

Interact with an AI assistant to get personalized answers about:

* Career paths
* Technologies
* Interview preparation
* Resume building
* Job roles
* Programming concepts
* Skill development

---

### 💼 Interview Preparation

Generate interview questions based on:

* Job role
* Experience level
* Technology
* Programming language
* Company type

Example:

```text
Role: Backend Developer
Technology: Node.js
Experience: Fresher
```

CareerAI can generate questions such as:

```text
1. What is middleware in Express.js?
2. How does Node.js handle asynchronous operations?
3. What is REST API?
4. Explain JWT authentication.
```

---

### 🧑‍💻 Technical Interview Practice

Practice questions from multiple technical domains:

* Java
* JavaScript
* React.js
* Node.js
* Express.js
* MongoDB
* SQL
* DBMS
* Operating Systems
* Computer Networks
* Data Structures & Algorithms
* System Design

---

### 📄 Resume Assistant

CareerAI can help users improve their resumes by providing suggestions for:

* Professional summary
* Technical skills
* Projects
* Internship descriptions
* Achievement statements
* ATS-friendly content

---

### 🎯 Personalized Career Guidance

Users can receive recommendations based on their:

* Skills
* Experience
* Target role
* Current knowledge
* Career goals

Example:

```text
Current Skills:
Java
SQL
React

Target Role:
Full Stack Developer
```

The system can suggest:

```text
Recommended Skills:

1. Node.js
2. Express.js
3. MongoDB
4. REST APIs
5. Git & GitHub
6. Docker
```

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* HTML5
* CSS3
* JavaScript
* Bootstrap / Tailwind CSS
* Axios
* React Router

### Backend

* 🟢 Node.js
* 🚂 Express.js
* REST APIs
* JWT Authentication

### Database

* 🍃 MongoDB
* Mongoose

### AI

* 🤖 Google Gemini API
* Generative AI
* Prompt Engineering

### Development Tools

* Git
* GitHub
* VS Code
* Postman / Thunder Client
* npm

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React.js UI    │
                    └────────┬─────────┘
                             │
                         REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js/Express  │
                    │     Backend      │
                    └───────┬──────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
       ┌───────────────┐         ┌───────────────┐
       │    MongoDB    │         │  Gemini API   │
       │   Database    │         │      AI       │
       └───────────────┘         └───────────────┘
```

---

## 📂 Project Structure

```text
CareerAI/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── README.md
└── package.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/CareerAI.git
```

Go inside the project:

```bash
cd CareerAI
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

⚠️ **Never upload your `.env` file to GitHub.**

Add this to `.gitignore`:

```text
node_modules/
.env
uploads/
```

---

# ▶️ Running the Application

## Start Backend

```bash
cd server
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔑 Authentication

CareerAI supports user authentication using:

```text
User
 ↓
Register
 ↓
Login
 ↓
JWT Token
 ↓
Protected API
 ↓
Dashboard
```

Example API:

```http
POST /api/auth/register
```

```http
POST /api/auth/login
```

---

# 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/profile`  | Get user profile |

### AI

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| POST   | `/api/ai/chat`      | Ask AI assistant             |
| POST   | `/api/ai/interview` | Generate interview questions |
| POST   | `/api/ai/resume`    | Analyze resume               |
| POST   | `/api/ai/career`    | Get career recommendations   |

---

# 🤖 AI Workflow

```text
User Question
      │
      ▼
React Frontend
      │
      ▼
Express REST API
      │
      ▼
AI Service
      │
      ▼
Gemini API
      │
      ▼
AI Response
      │
      ▼
React UI
```

---

# 📸 Screenshots

Add your project screenshots here:

```markdown
![Home Page](screenshots/home.png)

![AI Assistant](screenshots/ai-assistant.png)

![Interview Preparation](screenshots/interview.png)

![Dashboard](screenshots/dashboard.png)
```

---

# 🎯 Example Use Cases

### Fresher

```text
"I am a CSE student. How should I prepare for a
software developer interview?"
```

CareerAI can provide:

* DSA roadmap
* Java/JavaScript preparation
* DBMS questions
* OS questions
* Networking questions
* Projects to build
* Mock interview preparation

---

### Resume Preparation

```text
"Improve my project description for an ATS-friendly resume."
```

CareerAI provides professionally structured content.

---

### Interview Practice

```text
"Give me 10 Node.js interview questions for a fresher."
```

The AI generates questions and can explain their answers.

---

# 🔒 Security

The project follows basic security practices including:

* JWT authentication
* Environment variables
* Password hashing
* Protected routes
* API validation
* CORS configuration
* Helmet security headers

---

# 🚀 Future Improvements

Planned features include:

* 🎤 AI Voice Interview
* 📹 Video Mock Interviews
* 📊 Interview Performance Analytics
* 🧠 Personalized DSA Roadmap
* 📄 AI Resume Parser
* 🔎 Job Recommendation System
* 📧 Job Application Tracker
* 🏆 Gamified Interview Practice
* 🌐 Multi-language support
* 💬 Real-time AI Interviewer
* 📈 Skill Progress Dashboard

---

# 📈 Future Architecture

```text
                    CareerAI
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   AI Assistant    Interview AI    Resume AI
       │               │                │
       └───────────────┼────────────────┘
                       │
                       ▼
                 Career Engine
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     Job Matching              Skill Roadmap
```

---

# 👨‍💻 Developer

**Diwakar**

🎓 B.Tech — Computer Science & Engineering

### Skills

```text
Java
JavaScript
React.js
Node.js
Express.js
MongoDB
SQL
REST APIs
Git & GitHub
Data Structures & Algorithms
Generative AI
```

---

# ⭐ Contributing

Contributions are welcome!

### Fork the repository

```bash
git fork
```

### Create a branch

```bash
git checkout -b feature/new-feature
```

### Commit changes

```bash
git add .
git commit -m "Add new feature"
```

### Push

```bash
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📜 License

This project is created for educational and career-development purposes.

---

# ⭐ Support

If you find **CareerAI** useful, consider giving the repository a ⭐ on GitHub.

```text
⭐ Star the repository
🍴 Fork the project
🐛 Report issues
💡 Suggest features
🤝 Contribute
```

---

## 🚀 CareerAI

> **Learn. Practice. Improve. Get Hired.**

**CareerAI — Your AI-powered career companion.**
