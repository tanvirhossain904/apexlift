# ApexLift — Client

React + Vite frontend for the ApexLift performance-tracking app. See the [root README](../README.md) for the full project overview.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Axios (see [src/services/api.ts](src/services/api.ts) for the configured instance)
- Recharts (analytics)
- Lucide Icons

## Scripts

```bash
npm install
npm run dev      # start dev server (proxies /api → localhost:5000)
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Dev proxy

The Vite dev server proxies `/api/*` to `http://localhost:5000` — see [vite.config.ts](vite.config.ts). Run the backend in `../server` alongside `npm run dev` here.

## Structure

```
src/
├── components/     # shared UI (Layout, ProtectedRoute)
├── hooks/          # React hooks (useAuth)
├── pages/          # route-level views
├── services/       # Axios API wrappers
└── types/          # shared TypeScript interfaces
```
