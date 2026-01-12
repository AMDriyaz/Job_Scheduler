# Job Scheduler & Automation Dashboard

A simplified Job Scheduler system that allows users to create tasks, execute them asynchronously (simulated), track their status, and trigger webhooks.

## Architecture

- **Frontend**: Next.js 14 (App Router), Tailwind CSS.
- **Backend**: Node.js, Express.
- **Database**: SQLite (default) or MySQL (configurable via `.env`).
- **ORM**: Sequelize.

### Job Lifecycle
`PENDING` -> `RUNNING` -> `COMPLETED` (or `FAILED`)

## Setup Instructions

### Backend
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Start the server: `node server.js`.
   - Runs on `http://localhost:3001`.
   - SQLite database is created automatically at `./backend/database.sqlite`.

### Frontend
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.
   - Accessible at `http://localhost:3000`.

## API Documentation

### Jobs
- `POST /jobs`: Create a new job.
  - Body: `{ "taskName": "string", "priority": "LOW|MEDIUM|HIGH", "payload": {} }`
- `GET /jobs`: List all jobs.
- `GET /jobs/:id`: Get job details.

### Execution
- `POST /run-job/:id`: Trigger job execution.
  - Returns `202 Accepted` immediately.
  - Job runs in background (5s simulation).
  - Triggers webhook on completion.

## Webhooks
Simulated webhook delivery to `https://webhook.site` (or configurable via `WEBHOOK_URL`).
Payload includes `jobId`, `taskName`, `status`, and `completedAt`.

## AI Usage Report

### 1. AI Tools Used
- **Google Deepmind Antigravity**: Primary autonomous coding agent.

### 2. Model Names
- **Gemini 2.0**: The underlying large language model powering the agent.

### 3. Exact Prompts Used
The following prompts were used during the development and refinement of this project:

- *"Deploying Job Scheduler to Vercel"*
- *"Fixing Job Scheduler Bug"*
- *"The all is Fish now Deployed to vercel"*
- *"Why not run to server in local"*
- *"let ready to deployment"*
- *"The Server statsu in not work is that only show to offlinr status"*
- *"The Filter icon need to near by refrash not need to between"*
- *"The darck and light mode is nort work"*
- *"README must contain: 1. AI tools used... 2. Model names... 3. Exact prompts used..."*

### 4. Contributions by AI

- **UI Design**:
  - Implemented the Dashboard layout using Tailwind CSS.
  - Refined the header layout to align the **Filter** and **Refresh** buttons.
  - Fixed **Dark Mode** support by configuring Tailwind 4 variants (`globals.css`).

- **Backend Logic**:
  - Implemented the Express.js server structure.
  - Added the `/api/health` endpoint to resolve monitoring issues.
  - Configured `vercel.json` routing for deployment.

- **Debugging**:
  - Investigated and resolved a `500 Internal Server Error` related to MySQL configuration.
  - Fixed Vercel deployment routing issues.
  - Debugged local server connectivity (`CONNECTION_REFUSED`) by clearing stale locks.

- **Documentation**:
  - Created the **Implementation Plan** for deployment.
  - Wrote the **Vercel Deployment Checklist**.
  - Generated the **Project Walkthrough** with verification screenshots.
  - Updated this `README.md` with usage details.

