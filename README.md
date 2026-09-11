# 🚀 FlowOps

### Full-Stack Productivity & Project Management Platform

A modern full-stack productivity platform for managing projects, tasks, team workspaces, and AI-powered productivity insights.

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://flow-ops-final.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Akshay-1031/FlowOps)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure registration, login, session restoration, and protected routes
- 📁 **Project Management** — Create, update, and organize project workspaces
- ✅ **Task Management** — Create and manage tasks with status, priority, and assignments
- 👥 **Role-Based Access** — Project ownership, memberships, and authorization
- 🤖 **AI Productivity Insights** — Gemini-powered project analysis, priorities, bottlenecks, and next actions
- 🔗 **Event-Driven Webhooks** — Deliver application events to external systems
- 🛡️ **Security** — Helmet, CORS, authentication rate limiting, and centralized error handling
- 🧪 **Backend Testing** — Jest-based middleware and service tests
- 📱 **Responsive UI** — Modern React interface built with Tailwind CSS
- ☁️ **Production Deployment** — Vercel + Render + Neon PostgreSQL

---

## 🖥️ Live Demo

**[Launch FlowOps →](https://flow-ops-final.vercel.app)**

> The application is deployed as a production full-stack system with the frontend, backend, and database hosted separately.

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-2026-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-API_Client-5A29E4)

- React
- React Router
- Tailwind CSS v4
- Axios
- Lucide React
- Motion

### Backend

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-REST_API-000000?logo=express)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)

- Node.js
- Express.js
- JWT
- bcrypt
- Helmet
- CORS
- Jest

### Database

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)

- PostgreSQL
- Prisma ORM
- Neon

### AI & Integrations

- Google Gemini
- Webhooks
- REST APIs

### Deployment

- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │  React + Tailwind    │
                         │       Vercel         │
                         └──────────┬───────────┘
                                    │
                              REST / Axios
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         │    Node.js / API     │
                         │       Render         │
                         └──────┬─────┬─────────┘
                                │     │
                    ┌───────────┘     └────────────┐
                    ▼                              ▼
          ┌──────────────────┐          ┌──────────────────┐
          │   PostgreSQL     │          │   Google Gemini  │
          │   Prisma + Neon  │          │   AI Insights    │
          └──────────────────┘          └──────────────────┘
                                                   │
                                                   ▼
                                          ┌──────────────────┐
                                          │     Webhooks     │
                                          │ External Events  │
                                          └──────────────────┘

