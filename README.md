<div align="center">

# 🚀 FlowOps

**Full-stack productivity & project management platform with AI-powered insights, event-driven webhooks, and automated CI/CD.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00A0E4?style=for-the-badge)](https://flow-ops-final.vercel.app)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Akshay-1031/FlowOps)

</div>

---

---

## Overview

FlowOps is a full-stack productivity and project management platform for organizing projects, managing tasks, tracking progress, and generating AI-powered workspace insights.

The application combines:

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express (REST API) |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT-based authentication & authorization |
| AI | Google Gemini for productivity insights |
| Integrations | Event-driven webhooks |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Security Scanning | Trivy |
| Hosting | Vercel (frontend) · Render (backend) · Neon (database) |

---

## Features

**Core**
- JWT-based registration and login, with protected routes and role-based authorization
- Project creation, membership, and role management
- Task creation, assignment, status, and priority tracking
- AI-powered productivity insights via Google Gemini
- Event-driven webhook delivery to external systems

**Reliability & Security**
- Rate limiting on authentication endpoints
- Helmet security headers and configured CORS
- Centralized backend error handling
- Automated Jest test suite

**DevOps**
- Dockerized backend with container health checks
- Automated vulnerability scanning (Trivy) and dependency auditing
- CI/CD pipeline via GitHub Actions with automatic Render deployment

**UI**
- Responsive interface built with React + Tailwind CSS

---

## Tech Stack

<table>
<tr>
<td valign="top" width="20%">

**Frontend**
- React
- React Router
- Tailwind CSS v4
- Axios
- Lucide React
- Motion

</td>
<td valign="top" width="20%">

**Backend**
- Node.js
- Express
- JWT
- bcrypt
- Helmet
- CORS
- Jest

</td>
<td valign="top" width="20%">

**Database**
- PostgreSQL
- Prisma
- Neon

</td>
<td valign="top" width="20%">

**AI & Integrations**
- Google Gemini
- Webhooks

</td>
<td valign="top" width="20%">

**DevOps**
- Docker
- Docker Compose
- GitHub Actions
- Trivy

</td>
</tr>
</table>

**Deployment:** Vercel (frontend) · Render (backend) · Neon (PostgreSQL)

---

## Architecture

```text
                          Internet
                             │
                             ▼
                 ┌───────────────────────┐
                 │        Vercel         │
                 │    React Frontend     │
                 └───────────┬───────────┘
                              │ Axios
                              ▼
                 ┌───────────────────────┐
                 │        Render         │
                 │  Node.js + Express    │
                 │   (Docker Container)  │
                 └──────┬───────┬────────┘
                        │       │
            ┌───────────┘       └───────────┐
            ▼                                ▼
     ┌─────────────┐                  ┌─────────────┐
     │  Prisma ORM │                  │  Gemini AI  │
     └──────┬──────┘                  └─────────────┘
            ▼
     ┌─────────────┐                  ┌─────────────┐
     │    Neon     │                  │  Webhooks   │
     │ PostgreSQL  │                  │   Service   │
     └─────────────┘                  └─────────────┘
```

### Request Flow

**Standard API request**
```text
User → Vercel → React Frontend → Render → Express API
     → Auth/Authorization → Controller/Service
     → Prisma → Neon PostgreSQL → Response → User
```

**AI-powered request**
```text
React → Express API → AI Service → Google Gemini → Express API → React
```

**Webhook event**
```text
Application Event → Webhook Service → HTTP POST → External Endpoint
```

---

## Project Structure

```text
FlowOps/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── prisma/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vercel.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── README.md
└── package.json
```

---

## Authentication Flow

FlowOps uses JWT-based authentication with bcrypt password hashing (passwords are never stored in plaintext).

```text
User Login → Validate credentials → Compare password hash
   → Issue JWT → Frontend stores token
   → Authorization: Bearer <token>
   → JWT Auth Middleware → Role/Permission Middleware
   → Protected Route → Controller/Service
```

The backend verifies each JWT and attaches the authenticated user to the request before any protected route is processed.

---

## AI Insights

FlowOps integrates **Google Gemini** to analyze project and task data and generate productivity-oriented insights, including:

- Project summaries
- Priority suggestions
- Potential bottlenecks
- Recommended next actions

> All Gemini requests are proxied through the FlowOps backend — the API key is never exposed to the frontend.

---

## Webhooks

FlowOps includes an event-driven webhook layer that delivers application events to an external endpoint, decoupling external integrations from core project/task business logic.

---

## API Overview

**Authentication**
```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

**Projects**
```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

**AI**
```text
POST   /api/ai/projects/:projectId/analyze
```

**Health**
```text
GET    /api/health
```

---

## Health Checks

```text
GET /api/health
```

```json
{
  "status": "ok",
  "message": "FlowOps API is running"
}
```

The backend Docker image also defines a `HEALTHCHECK`, which periodically polls this endpoint — letting the runtime distinguish between *"the container is running"* and *"the application is actually responding."*

---

## Testing

Backend tests use **Jest**:

```bash
cd backend
npm test
```

Current coverage includes:
- Authentication middleware
- Role-based middleware
- Webhook service behavior

The CI pipeline runs the full suite automatically on every push and pull request targeting `main`.

---

## Docker

The backend is containerized using a **multi-stage Docker build**. The build stage installs only production dependencies (`npm ci --omit=dev`); the final runtime image ships the app and production dependencies only, with npm excluded from the runtime.

**Build locally**
```bash
docker build -t flowops-backend:ci ./backend
```

**Run locally**
```bash
docker run --name flowops-backend \
  --env-file ./backend/.env \
  -p 5000:5000 \
  flowops-backend:ci
```

| | |
|---|---|
| API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

**Docker Compose** (for local container management)
```bash
cd backend
docker compose up --build   # start
docker compose down         # stop
```

---

## CI/CD Pipeline

GitHub Actions automates testing, image building, security scanning, and deployment on every push/PR to `main`.

```text
Git Push
   │
   ▼
GitHub Actions
   ├── Install dependencies
   ├── Run Jest tests
   ├── Build Docker image
   ├── Trivy vulnerability scan
   └── Production dependency audit (npm audit)
   │
   ▼
All checks pass
   │
   ▼
Render Deploy Hook → Render Deployment
```

Deployment is only triggered **after** all checks succeed — code never reaches production without passing tests, security scans, and a dependency audit first.

---

## Security

**Application**
- JWT authentication + bcrypt password hashing
- Role-based authorization
- Helmet security headers, configured CORS
- Authentication rate limiting
- Centralized error handling

**Pipeline & Runtime**
- Secrets kept out of source control (`.env` gitignored)
- Production-only dependencies in the runtime image
- Trivy scans the Docker image for **HIGH**/**CRITICAL** vulnerabilities
- `npm audit --omit=dev --audit-level=high` checks the dependency tree independently of the image scan
- Alpine base image kept patched; npm removed from the production runtime; `.dockerignore` trims build context
- Automated checks gate every deployment

---

## Environment Variables

Create a `backend/.env` file (see `.env.example` for the template — never commit `.env`):

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
WEBHOOK_URL=your_webhook_url
FRONTEND_URL=http://localhost:5173
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GEMINI_API_KEY` | Google Gemini authentication |
| `WEBHOOK_URL` | External webhook destination |
| `FRONTEND_URL` | Allowed frontend origin (CORS) |

---

## Local Development

### Prerequisites
- Node.js & npm
- PostgreSQL (local or hosted)
- Google Gemini API key
- Docker Desktop *(optional, for containerized development)*

### Setup

```bash
git clone https://github.com/Akshay-1031/FlowOps.git
cd FlowOps
```

**Backend**
```bash
cd backend
npm install
# create backend/.env from .env.example
npm run contract:emit   # if required by the Prisma setup
npm start
```
Runs at `http://localhost:5000` · health check at `/api/health`

**Frontend** (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

---

## Production Deployment

| Service | Provider | URL |
|---|---|---|
| Frontend | Vercel | https://flow-ops-final.vercel.app |
| Backend | Render | https://flowops-wglc.onrender.com |
| Backend health | Render | https://flowops-wglc.onrender.com/api/health |
| Database | Neon | — connected via `DATABASE_URL` |

**Vercel config:** Framework: Vite · Root Directory: `frontend` · Output Directory: `dist`

The backend is containerized with Docker and deployed automatically through the CI/CD pipeline described above.

### Full Deployment Lifecycle

```text
Code change → git commit → git push origin main
    → GitHub Actions (tests → Docker build → Trivy scan → npm audit)
    → checks pass → Render Deploy Hook → Render deployment
    → new container → Docker HEALTHCHECK → live production backend
```

---

## Why Docker + CI/CD

Docker gives the backend a **consistent, reproducible runtime** across local, CI, and production environments. GitHub Actions automates verification of every change — tested, built, security-scanned, and dependency-audited — before it's ever allowed to deploy. Together, this replaces manual, error-prone deployment steps with a repeatable development-to-production pipeline.

---

## Future Improvements

- Real-time task updates
- Advanced notifications & analytics dashboards
- More granular permissions
- File attachments & calendar integration
- Expanded AI workflows
- Background job processing
- Improved observability and monitoring
- Automated database migration workflows
- Broader integration/end-to-end test coverage

---

## Author

**Venkat Akshay Grandhi**
[GitHub](https://github.com/Akshay-1031/FlowOps)
