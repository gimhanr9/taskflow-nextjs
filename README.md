# Kanvoro — Production Full-Stack SaaS Project Management Platform

A high-velocity, production-grade project management application built with **Next.js (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, **Tailwind CSS**, and **Jose JWT Session Security**.

Designed to showcase clean software architecture, robust relational data modeling, strict tenant data isolation, and a modern, distraction-free SaaS user interface.

---

## 🌟 Key Features

- **Interactive Kanban Board**: Move tasks across *To Do*, *In Progress*, and *Done* columns with native HTML5 drag-and-drop and accessible one-click column shift controls with immediate database persistence.
- **Projects Management**: Comprehensive project lifecycle tracking with status badges (*Planning*, *Active*, *On Hold*, *Completed*), custom color accents, priority levels, start/due dates, and automatically computed task progress bars.
- **Real-Time Dynamic Analytics**: Built with Recharts to visualize 7-day task completion velocities, status distributions (donut charts), priority volume breakdowns, and project milestones calculated directly from database records.
- **Audited Activity Feed**: Automated audit logging of project creation, task movements, completions, and profile updates.
- **Strict Row-Level Tenancy**: Every database query is strictly scoped by `userId`. User accounts cannot access, view, or mutate another user's projects or tasks under any circumstance.
- **Session Authentication via Jose**: Stateless, Edge-compatible JWT tokens encrypted with `HS256` and stored in `HttpOnly`, `SameSite=Lax` secure cookies. Passwords hashed using `bcryptjs` with salt rounds.
- **Portfolio-Ready Demo Mode**: Instant one-click sign-in button on the landing page and login screen allowing clients and evaluators to explore pre-populated projects without manual registration.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict Typing) |
| **Styling** | Tailwind CSS v4, Lucide Icons |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM 6 |
| **Authentication** | Jose JWT (`HS256`) + `bcryptjs` + HTTPOnly Session Cookies |
| **Validation** | Zod (End-to-End type safety) |
| **Charts & Data Viz** | Recharts (Responsive bar & pie charts) |
| **Date Handling** | date-fns (relative countdowns and milestone formatting) |

---

## 🏗️ Relational Schema Architecture

```
User (Tenant Account)
 ├── id, name, email, password, role, jobTitle, bio, avatarUrl
 ├── Projects [1 -> N] (Cascade Delete)
 │    ├── id, title, description, status, priority, color, startDate, dueDate
 │    └── Tasks [1 -> N] (Cascade Delete)
 │         ├── id, title, description, status, priority, order, dueDate, completedAt
 └── ActivityLogs [1 -> N] (Audit Trail)
      └── id, action, details, entityType, entityId, createdAt
```

### Database Indexes
- `projects`: `[userId]`, `[userId, status]`, `[userId, priority]`
- `tasks`: `[userId]`, `[projectId]`, `[userId, status]`, `[projectId, status]`
- `activity_logs`: `[userId]`, `[userId, createdAt]`

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database instance running locally (or remote on Neon / Supabase / Railway)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/gimhanr9/taskflow-nextjs.git
cd taskflow-nextjs
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL connection string and a secret key:
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/taskflow?schema=public"
JWT_SECRET="taskflow_jwt_secret_key_production_grade_32_characters_minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Demo Data
```bash
# Push Prisma schema to PostgreSQL
npm run db:push

# Seed realistic demo data (Alex Chen + isolated second user)
npm run db:seed
```

### 4. Run Automated Test Suite
```bash
npm test
```
*Validates Zod schemas, JWT cryptography, project & task CRUD, Kanban transitions, cascade deletions, and tenant data isolation.*

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Account Credentials

Portfolio reviewers can click **"Explore Live Demo"** on the landing page or enter:
- **Email**: `demo@kanvoro.dev`
- **Password**: `TaskFlow123!`

---

## 🚢 Deployment Guide (Vercel & Managed PostgreSQL)

Kanvoro is optimized for zero-config deployment to [Vercel](https://vercel.com) alongside any managed PostgreSQL provider ([Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

### Steps:
1. **Provision Database**: Create a PostgreSQL database on Neon or Supabase and copy the connection string.
2. **Environment Variables**: Add the following in your Vercel Project Settings:
   - `DATABASE_URL`: `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`
   - `JWT_SECRET`: Random 32+ character string (e.g. generated with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_APP_URL`: Production domain (e.g. `https://your-taskflow.vercel.app`)
3. **Build Command**: Set build command to:
   ```bash
   prisma generate && next build
   ```
4. **Seed Production (Optional)**: Run `npm run db:seed` from your local terminal with the remote `DATABASE_URL` configured to populate the initial demo account.

---

## 🧪 Available Scripts

- `npm run dev` — Starts the local Turbopack development server.
- `npm run build` — Compiles optimized production bundle and runs TypeScript checks.
- `npm run start` — Serves the production build.
- `npm run lint` — Runs ESLint checks.
- `npm test` — Executes the automated validation and tenancy isolation test suite.
- `npm run db:push` — Synchronizes Prisma schema directly with the database.
- `npm run db:seed` — Populates database with sample workspace initiatives and tasks.

---

## 📄 License
MIT License. Built for software engineering portfolio and freelance demonstration.
