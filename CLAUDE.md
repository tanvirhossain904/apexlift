# ApexLift — Project Memory

## Project Overview

ApexLift is a production-level MERN stack gym application — a professional performance-tracking engine for gym-goers. It allows users to manage training programs and visualize volume analytics to support informed, progressive training decisions.

**Core Value Proposition:** Help athletes track workouts, apply progressive overload systematically, and understand their training volume through clear analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Lucide Icons, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| Language | TypeScript (frontend + backend) |

---

## Project Structure

Monorepo with separate `client/` and `server/` packages:

```
ApexLift/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/        # Axios API calls
│   │   ├── types/           # Shared TypeScript interfaces
│   │   └── utils/
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/
│   │   ├── middleware/      # Auth, validation
│   │   ├── services/        # Business logic
│   │   └── utils/
│   └── tsconfig.json
└── CLAUDE.md
```

---

## Core Data Entities

### User
- `_id`, `email`, `passwordHash`, `name`
- `preferredUnit`: `"kg" | "lbs"`
- `createdAt`, `updatedAt`

### Program
A collection of workout sessions forming a training block.
- `_id`, `userId`, `name`, `description`
- `sessions`: `Workout[]`
- `startDate`, `endDate`, `isActive`

### Workout
A single training session within a program.
- `_id`, `programId`, `userId`, `name`
- `date`: `Date`
- `exercises`: `Exercise[]`
- `notes`: `string`

### Exercise
A specific movement performed in a workout with sets, reps, and weight.
- `_id`, `workoutId`, `name`
- `sets`: `ExerciseSet[]`
  - `reps`: `number`
  - `weight`: `number` (always numeric, unit determined by user preference)
  - `rpe?: number`
- `muscleGroup`: `string`
- `notes?: string`

---

## Business Logic Rules

### Weight Storage
- Weight is **always stored as a number** (never a string).
- The unit (KG or LBS) is stored on the `User` document (`preferredUnit`).
- Conversion is handled at the presentation layer only — raw DB values are always numeric.

### Progressive Overload Tracking
- Compare the same exercise across consecutive workouts within a program.
- Calculate volume per set: `weight × reps`.
- Flag progression when total session volume for an exercise increases week-over-week.
- Expose a `progressionStatus` field on the exercise level: `"progressed" | "maintained" | "regressed" | "new"`.

### Weekly Volume (MongoDB Aggregation)
- Use MongoDB Aggregation Pipelines to calculate weekly training volume.
- Group workouts by `userId` + ISO week number.
- Sum `weight × reps` across all sets for all exercises in the week.
- Expose this as a time-series endpoint for the analytics dashboard.

```
Pipeline sketch:
$match userId → $unwind exercises → $unwind sets
→ $addFields { setVolume: { $multiply: ["$sets.weight", "$sets.reps"] } }
→ $group by { userId, isoWeek }
→ $sort by week ascending
```

---

## Style Guide

- **Theme:** Dark mode fitness aesthetic — deep backgrounds (`zinc-900`, `zinc-800`), accent colors in amber/orange for energy and performance cues.
- **Typography:** Clean, bold headings; readable body text with high contrast ratios.
- **Components:** Utility-first with Tailwind CSS; mobile-responsive layouts (mobile-first breakpoints).
- **Icons:** Lucide Icons exclusively — consistent stroke weight, no mixed icon libraries.
- **TypeScript:** TypeScript-first throughout. All props, API responses, and DB models must be typed. Avoid `any`.
- **API Communication:** All HTTP calls via Axios instances with base URL and auth interceptors configured centrally in `client/src/services/api.ts`.

---

## Progress

_Updated when a major feature is completed. Log the feature name, date, and a one-line summary of what was shipped._

| Date | Feature | Notes |
|------|---------|-------|
| 2026-04-22 | Project scaffold | `client/` (Vite + React + TS + Tailwind v4 + Lucide + Axios) and `server/` (Express + Mongoose + JWT + TS) initialized with full folder structure |
| 2026-04-22 | Core Mongoose models | `User`, `Program`, `Workout` with nested `Exercise[]` → `ExerciseSet[]` subdocuments |
| 2026-04-22 | JWT auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (protected) |
| 2026-04-22 | Workout CRUD | Full REST for workouts + exercise sub-resource mutations (`$push`/`$set` with arrayFilters/`$pull`) |
| 2026-04-22 | Progressive overload + volume analytics | `progressionService` compares last 2 workouts per exercise; weekly volume aggregation pipeline via `$isoWeek` grouping |
| 2026-04-22 | Frontend pages | Dashboard, Workout Logger, Analytics (recharts), Programs placeholder; auth context, protected routes, full service layer |

---

## Technical Decisions

_Updated when a significant architectural or schema decision is made. Capture what was decided and why, so future sessions don't re-litigate resolved choices._

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-22 | Monorepo with `client/` + `server/` | Keeps frontend and backend in one repo for easier cross-cutting changes while maintaining clear separation |
| 2026-04-22 | Weight always stored as numeric (no unit embedded) | Unit conversion at presentation layer keeps aggregation math simple and unit-agnostic |
| 2026-04-22 | JWT for auth (no sessions) | Stateless auth fits a REST API; simpler to scale horizontally |
| 2026-04-22 | Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`) | v4 uses CSS-first config (`@import "tailwindcss"`) + Vite plugin — no PostCSS setup needed |
| 2026-04-22 | Vite proxy `/api` → `localhost:5000` | Avoids CORS in dev; production will use a real reverse proxy or same-origin deployment |

---

## Current Status

**Phase:** Foundation

- [x] Scaffold `client/` (React + Vite + TypeScript + Tailwind)
- [x] Scaffold `server/` (Express + TypeScript)
- [x] Connect MongoDB via Mongoose
- [x] Implement JWT auth (register, login, protected routes)
- [x] Build core Mongoose models (User, Program, Workout, Exercise)
- [x] Workout CRUD routes + exercise sub-resource operations
- [x] Implement progressive overload service
- [x] Implement weekly volume aggregation endpoint
- [x] Build frontend pages (Dashboard, Programs, Workout Logger, Analytics)
