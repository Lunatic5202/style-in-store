# Style In Store

A location-aware store discovery and shopping-browse experience. The site introduces the service, explains how it works for shoppers and stores, and provides a dedicated browse route for exploring nearby stores and product listings.

## Current experience

- **Home (`/`)** — introduction, how-it-works section, store-focused information, feature overview and call to action.
- **Browse (`/browse`)** — location selection/current-location flow, nearby-store discovery, search/filter controls and product browsing.
- **Store discovery** — location helpers are in `src/lib/locationService`.
- **Product data integration** — store-product scraping is isolated under `src/lib/api/scrapeStore`.
- **UI feedback** — toast notifications, reusable Radix/shadcn components and responsive layouts.

Product templates are present in the browse implementation. Do not interpret a template listing, displayed price or stock state as verified live inventory unless the connected store source confirms it.

## Tech stack

- React 18, TypeScript and Vite
- React Router
- Tailwind CSS and shadcn/ui (Radix UI)
- TanStack Query
- Supabase client
- Leaflet / React Leaflet for map-related UI
- Vitest and Testing Library

## Getting started

Requires Node.js and npm.

```bash
git clone https://github.com/Lunatic5202/style-in-store.git
cd style-in-store
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run Vitest in watch mode |

## Project structure

```text
src/
├── components/       Shared page sections and UI components
├── hooks/            Reusable React hooks
├── lib/              Location and store/product integrations
├── pages/            Home, Browse and not-found routes
└── App.tsx           Providers and route definitions
public/               Static assets
supabase/             Supabase project resources
```

## Configuration and data

Review the Supabase and location-service integration before deploying. Configure required public client settings through the environment mechanism used by the application; never commit service-role keys, private API credentials or real customer data.

## Quality checks

Before opening a pull request, run:

```bash
npm run lint
npm test
npm run build
```

Document any external store API, scraping, geolocation or inventory limitations alongside changes that affect those flows.
