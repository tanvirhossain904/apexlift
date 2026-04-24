# ApexLift

A production-grade MERN workout tracker built for serious lifters. Log every set, track progressive overload per exercise, and visualise weekly training volume through clean analytics.

Train smarter. Lift heavier. Every rep is a data point — every data point is progress.

---

## Features

- **Workout logging** — fast, mobile-first session logging with sets, reps, weight, and RPE.
- **Progressive overload tracking** — compares the two most recent sessions per exercise and labels each as `progressed`, `maintained`, `regressed`, or `new`.
- **Weekly volume analytics** — MongoDB aggregation pipeline (`$isoWeek`) produces a clean time-series of training volume across your full history.
- **Muscle-group distribution** — breaks down volume share across muscle groups.
- **KG & LBS** — unit preference stored per-user; weights are always numeric in the DB, converted at the presentation layer.
- **JWT auth** — stateless, protected API; bcrypt-hashed passwords.

## Tech stack

| Layer    | Tech                                                    |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Axios, Lucide Icons |
| Backend  | Node.js, Express 5, TypeScript                          |
| Database | MongoDB + Mongoose                                      |
| Auth     | JWT + bcrypt                                            |
| Security | Helmet, CORS allow-list, rate-limited auth endpoints    |

## Repository layout

```
ApexLift/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types/
├── server/          # Express + Mongoose backend
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
└── README.md
```

## Getting started

### Prerequisites

- Node.js **≥ 20**
- MongoDB — local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone & install

```bash
git clone <your-repo-url> apexlift
cd apexlift
npm run install:all
```

### 2. Configure the backend

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/apexlift
JWT_SECRET=<generate with: openssl rand -hex 48>
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Run in development

```bash
npm run dev           # starts server + client together
# or individually:
npm run dev:server
npm run dev:client
```

Open http://localhost:5173.

### 4. Build for production

```bash
npm run build         # builds server to server/dist + client to client/dist
npm start             # runs the compiled API
```

## API

All routes are prefixed with `/api`. Auth-protected routes expect `Authorization: Bearer <jwt>`.

### Auth

| Method | Route              | Auth | Description                       |
| ------ | ------------------ | ---- | --------------------------------- |
| POST   | `/auth/register`   | —    | Create a user and issue a token.  |
| POST   | `/auth/login`      | —    | Exchange credentials for a token. |
| GET    | `/auth/me`         | ✓    | Return the current user.          |

### Workouts

| Method | Route                                            | Description                       |
| ------ | ------------------------------------------------ | --------------------------------- |
| POST   | `/workouts`                                      | Create a workout.                 |
| GET    | `/workouts?programId&from&to`                    | List the user's workouts.         |
| GET    | `/workouts/:workoutId`                           | Fetch a single workout.           |
| PUT    | `/workouts/:workoutId`                           | Update top-level fields.          |
| DELETE | `/workouts/:workoutId`                           | Delete a workout.                 |
| POST   | `/workouts/:workoutId/exercises`                 | Add an exercise.                  |
| PUT    | `/workouts/:workoutId/exercises/:exerciseId`     | Update an exercise / replace sets.|
| DELETE | `/workouts/:workoutId/exercises/:exerciseId`     | Remove an exercise.               |

### Analytics

| Method | Route                                     | Description                                 |
| ------ | ----------------------------------------- | ------------------------------------------- |
| GET    | `/analytics/volume/weekly?from&to`        | ISO-week volume totals as a time series.    |
| GET    | `/analytics/muscle-distribution?from&to`  | Volume + set counts grouped by muscle group.|
| GET    | `/analytics/progression?exerciseName&programId` | Progression status for a single exercise.   |

## Data model

```
User      → { email, passwordHash, name, preferredUnit }
Program   → { userId, name, workoutIds[], startDate, endDate, isActive }
Workout   → { userId, programId?, name, date, exercises[], notes }
Exercise  → { name, muscleGroup, sets[], notes }
Set       → { reps, weight, rpe? }
```

Weight is always stored as a **numeric value**; the unit (kg / lbs) lives on the `User` document. This keeps aggregation math simple and unit-agnostic.

## Security

- Passwords hashed with bcrypt (12 salt rounds).
- JWT signed with `JWT_SECRET`; invalid tokens return 401.
- All workout/analytics routes are scoped by `userId` server-side — users can only ever read or mutate their own data.
- `helmet` adds secure response headers.
- CORS restricted to the `CORS_ORIGIN` allow-list.
- `/api/auth/*` rate-limited (20 requests / 15 minutes per IP).
- Route parameters validated as Mongo ObjectIds before DB access.
- Request body capped at 100kb.

**Before publishing / deploying:**

1. Generate a fresh `JWT_SECRET` (`openssl rand -hex 48`).
2. Rotate your MongoDB Atlas password and restrict network access to your deployment IPs.
3. Set `CORS_ORIGIN` to your production client URL.
4. Never commit `server/.env` — it is gitignored, keep it that way.

## License

MIT
