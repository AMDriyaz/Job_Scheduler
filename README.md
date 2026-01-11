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

## AI Usage Disclosure
This project was generated with the assistance of Google's AI agent to demonstrate automated coding capabilities.
