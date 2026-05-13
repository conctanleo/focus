# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Focus is a full-stack productivity app combining a Pomodoro timer, schedule/task planner, and memo notes. It uses a single Express server that serves both REST API routes and a Socket.io real-time layer, with a React SPA frontend.

```
browser (React SPA)  ── /api/*, /socket.io ──►  Vite dev proxy  ──►  Express (port 3001)
                                                            │
                                                     Prisma + SQLite
```

**Backend** (`server/`): Express 5 with JWT auth middleware. REST routes for CRUD on tasks, memos, and schedule notes. A `node-cron` job runs every minute, queries for tasks whose `scheduledStartAt` has passed, and pushes `pomodoro-reminder` events to the owning user's socket.

**Frontend** (`src/`): React 19 SPA with React Router 7 (3 pages: Pomodoro, Schedule, Memo). Zustand stores for auth state (`useAuth`) and timer state (`useTimer`). The auth store auto-fetches the current user on app mount; if the JWT is missing or invalid, the API interceptor redirects to `/login`.

**Database**: SQLite via Prisma 7 with better-sqlite3 adapter. Prisma client is generated into `src/generated/prisma/` and imported by server code from there (the `@/` alias maps `src/`).

## Commands

```bash
npm run dev           # Vite dev server (port 5173) — proxies /api to 3001
npm run dev:server    # Express API server (port 3001) with hot-reload via tsx
npm run build         # TypeScript-check + Vite production build
npm run db:migrate    # prisma migrate dev (apply migrations)
npm run db:generate   # prisma generate (regenerate client after schema changes)
npm run db:studio     # prisma studio (GUI database browser)
```

Run both `npm run dev` and `npm run dev:server` concurrently during development. The Vite dev server proxies `/api` and `/socket.io` to the Express server.

## Key conventions

- **Dates are strings**: All dates in the API and database are `YYYY-MM-DD` strings (not ISO timestamps), except `scheduledStartAt`/`scheduledEndAt` which are full DateTime. Use `lib/calendar.ts` helpers (`todayStr()`, `dateStr()`) for formatting.
- **Auth**: JWT token stored in `localStorage` under key `token`. The Axios interceptor in `lib/api.ts` attaches it as `Bearer` on every request. On 401, the token is cleared and the user redirected to `/login`.
- **Pomodoro state machine**: Tasks have `pomodoroStatus`: `idle` → `running` → `paused`/`done`. The client-side timer runs independently (Zustand store) and calls API endpoints to sync status. The cron job only triggers reminders for tasks still in `idle` status with `notifiedAt: null`.
- **Route protection**: All server routes except `/api/auth/register` and `/api/auth/login` require the `authMiddleware`. The frontend `AuthGuard` component wraps all app routes.
- **Prisma client path**: Generated to `src/generated/prisma/`. After `db:migrate` or schema changes, run `db:generate` to update the client.
