# 🚀 Job Portal SaaS



A modern full-stack **Job Portal SaaS** platform that connects **Job Seekers**, **Recruiters**, and **Administrators** through a secure, scalable, and user-friendly web application.

The project is built with **React + TypeScript** for the frontend and **FastAPI + PostgreSQL** for the backend.

---

# 📖 Overview

The Job Portal SaaS provides an end-to-end recruitment platform where:

- 👤 Users can search and apply for jobs.
- 🏢 Recruiters can manage companies and post jobs.
- 🛡️ Administrators can monitor platform activities.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- Google OAuth Login
- JWT Authentication
- Protected Routes
- Role-Based Access

---

## 👤 User Module

- User Dashboard
- Profile Management
- Resume Upload
- Browse Jobs
- Search Jobs
- Filter Jobs
- View Job Details
- Apply for Jobs
- View Applications
- Account Settings

---

## 🏢 Recruiter Module

- Recruiter Dashboard
- Company Profile
- Post New Jobs
- Edit Jobs
- Delete Jobs
- View Applicants
- Manage Applications

---

## 🛡️ Admin Module

- Dashboard
- User Management
- Company Management
- Job Monitoring
- Application Monitoring
- Platform Overview

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Node.js
- Tailwind CSS
- React Router
- React Query
- Google OAuth
- Axios
- Lucide React

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Google OAuth Verification
- Pydantic
- Uvicorn

---

## Database

- PostgreSQL

---

# 📂 Project Structure

job-portal/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── server/
│   │   ├── _core/
│   │   └── ...
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── recruiter/
│   │   │   ├── user/
│   │   │   └── admin/
│   │   │
│   │   ├── contexts/
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── lib/
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── recruiter/
│   │   │   ├── user/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── styles/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
│
├── growth-dashboard-backend-main/
│   │
│   ├── app/
│   │   ├── models/
│   │   │   ├── application.py
│   │   │   ├── company.py
│   │   │   ├── job.py
│   │   │   ├── profile.py
│   │   │   └── user.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── company.py
│   │   │   ├── job.py
│   │   │   ├── profile.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── company.py
│   │   │   ├── job.py
│   │   │   ├── profile.py
│   │   │   └── user.py
│   │   │
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   └── __init__.py
│   │
│   ├── requirements.txt
│   ├── .env
│   ├── venv/
│   └── README.md
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/job-portal-saas.git
```

```bash
cd job-portal
```

---

# 💻 Frontend Setup

Install dependencies

```bash
npm install
```

Run the frontend

```bash
cd job-portal-saas-frontend
npm run dev
```

Frontend URL

```
http://localhost:3000
```

---

# ⚙️ Backend Setup

Navigate to backend

```bash
cd job-portal-saas-backend
cd growth-dashboard-backend-main
cd growth-dashboard-backend-main
```

Create virtual environment (first time only)

```bash
python -m venv venv
```

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_portal

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

GOOGLE_CLIENT_ID=your_google_client_id
```

---

# 🗄️ Database

Database Used:

- PostgreSQL

Tables

- Users
- Profiles
- Companies
- Jobs
- Applications

---

# 🔐 Authentication

- Email & Password Login
- Google OAuth Login
- JWT Access Tokens
- Protected Routes
- Role-Based Authorization

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/auth/register` |
| POST | `/auth/login` |
| POST | `/auth/google` |
| GET | `/auth/profile` |

---

## User

| Method | Endpoint |
|---------|----------|
| GET | `/user` |
| PUT | `/user` |

---

## Profile

| Method | Endpoint |
|---------|----------|
| GET | `/profile` |
| PUT | `/profile` |

---

## Company

| Method | Endpoint |
|---------|----------|
| GET | `/company` |
| POST | `/company` |
| PUT | `/company/{id}` |

---

## Job

| Method | Endpoint |
|---------|----------|
| GET | `/job` |
| GET | `/job/{id}` |
| POST | `/job` |
| PUT | `/job/{id}` |
| DELETE | `/job/{id}` |

---

# 🚀 Running the Project

## Terminal 1

```bash
npm install
npm run dev
```

---

## Terminal 2

```bash
cd growth-dashboard-backend-main
cd growth-dashboard-backend-main

venv\Scripts\activate

uvicorn app.main:app --reload
```

---

# 🔒 Security

- JWT Authentication
- Google OAuth
- Password Validation
- Role-Based Access Control
- Secure API Communication

---

# 🎯 Future Enhancements

- Resume Parsing
- AI Resume Screening
- AI Job Recommendations
- Email Notifications
- Real-Time Chat
- Interview Scheduling
- Video Interview Support
- Payment Integration
- Recruiter Subscription Plans
- Analytics Dashboard

---

# 🤝 Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author
Manvitha Nalla 


