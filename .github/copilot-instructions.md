<!-- Copilot / AI agent instructions for the Postro codebase -->

# Postro — Copilot Instructions (concise)

This file gives immediate, actionable context for an AI coding agent working in this repository.

- **Big picture:** Vite + React + TypeScript storefront backed by Firebase (Firestore). Real-time product inventory is pushed to clients via Firestore listeners. Admin workflows live in `src/pages/AdminPage.tsx` and operate on `products` and `sales_log` Firestore collections.

- **How to run (local dev):**
  - Install: `npm install`
  - Dev: `npm run dev` (runs `vite`)
  - Build: `npm run build` (runs `tsc -b && vite build`)
  - Preview production build: `npm run preview`

- **Environment / secrets:**
  - Firebase keys are read from `import.meta.env` and expected to be prefixed with `VITE_` (see `src/firebase/config.ts`).
  - Keys used: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
  - Never commit `.env` — README and `SETUP.md` show `cp .env.example .env` workflow.

- **Core data flows & files to inspect:**
  - `src/firebase/config.ts` — validates and initializes Firebase; helpful for error messages and env keys.
  - `src/firebase/products.ts` — all product CRUD, `subscribeToProducts` (real-time), `decreaseStock` uses Firestore `increment`.
  - `src/firebase/salesLog.ts` — logging sales and analytics helpers: `logSale`, `getTopSellingProducts`, `clearAllSalesLogs`.
  - `src/pages/HomePage.tsx` — subscribes to products and wires `ProductGrid`/filters.
  - `src/pages/AdminPage.tsx` — admin UI, product upload (image URL based), sales logbook, and the admin password constant used in dev (`postro2025`).
  - `src/data/sampleProducts.ts` — sample seed data and `seedDatabase()` helper (commented out).
  - `src/types/index.ts` — canonical `Product` and `SaleLog` shapes — use these types when changing data shape.

- **Project-specific conventions / gotchas:**
  - Image handling: images are external URL-based (no storage upload). AdminPage instructs using the direct image address (e.g., right-click Imgur → "Copy image address"). Tests/changes should preserve this behavior.
  - Admin auth: a simple client-side password gate is in `AdminPage.tsx` (dev only). Do not treat it as production auth; update before any public release.
  - Real-time UX: Home uses `subscribeToProducts` (onSnapshot). Code should handle possible `firebaseConfigError` or missing `db` gracefully.
  - Firestore timestamps are converted to `Date` before exposing to UI (`.toDate()`) — maintain this convention when adding helpers.

- **Where to change / extend features:**
  - Add product fields: update `src/types/index.ts`, then update `src/firebase/products.ts` methods and admin form in `src/pages/AdminPage.tsx`.
  - Seed data: use `src/data/sampleProducts.ts` and call `seedDatabase()` in a one-off script while dev Firebase is configured.

- **Useful examples to copy from repo:**
  - Real-time subscription pattern: `subscribeToProducts` in `src/firebase/products.ts` and usage in `src/pages/HomePage.tsx`.
  - Safe DB access pattern: `ensureDb()` in both `products.ts` and `salesLog.ts` — use it to throw clear errors when env is missing.

- **Testing & debugging tips:**
  - If Firebase keys are missing, `src/firebase/config.ts` exports `firebaseConfigError` and `missingFirebaseKeys` — check these messages first.
  - Run `npm run dev` and look at console logs for `subscribeToProducts` or admin errors; AdminPage logs errors and shows toasts.

- **What not to change without coordination:**
  - The Firestore collection names: `'products'` and `'sales_log'` are used across services and in admin UI.
  - The frontend data shape in `src/types/index.ts` — changing it requires coordinated updates to Firestore readers/writers and UI components.

If anything in these instructions is unclear or you'd like more specifics (example PRs, test harness, or CI hooks), tell me which area to expand and I will iterate.
