# AGENTS.md - Hadi Trans Bali

Next.js 16 (App Router, `output: 'export'` static site) + React 19 (no TS, no tests). Firebase Hosting + Firestore + Cloud Functions. A pre-migration Vite copy lives in `../hadi-trans-bali-vite-backup`.

## Commands

- `npm run dev | build | lint` — `build` writes the static site to `out/` (it shares `.next` with `next dev`, so do not build while a dev server is running: build in a scratch copy or stop dev first); `lint` is `eslint .` (ignores `.next/`, `out/`, `functions/`) and has pre-existing unused-var errors.
- `functions/` is a separate npm project (CommonJS, Node 18): run `serve | deploy | logs` from inside `functions/`.
- Deploy: `firebase deploy --only hosting` (`out/`; `/tour/**`, `/blog/**`, `/ticket/**` rewrite to the `_` placeholder page for ids not built statically) or `--only functions`. Project `hadi-trans-bali` (alias `haditransbali`).

## Architecture

- Entry: `src/app/layout.jsx` (server; global metadata) → `Providers` (`CurrencyProvider > ThemeProvider > AuthProvider > LanguageProvider`) → `AppShell` (hides Navbar/Footer/WhatsAppFloat on `/admin*`). `src/app/template.jsx` fades pages in.
- Routes are `src/app/**/page.jsx` (server wrappers exporting `metadata`/`generateMetadata`) rendering client views from `src/views/` (NOT `src/pages/`, Next would treat that as the Pages Router). `/tour/[id]`, `/blog/[slug]`, `/ticket/[reference]` use `generateStaticParams` from static data plus a `_` placeholder; views read the real id with `useLastSegment()` from `src/lib/router.jsx` (react-router-style shim over `next/link`/`next/navigation`). `/packages` redirects to `/services/` in `firebase.json`. `sitemap.js`/`robots.js` generate both files; site URL from `NEXT_PUBLIC_SITE_URL` (`src/lib/site.js`).
- Data: static files in `src/data/` (`packages`, `services` = fleet, `posts`, `testimonials`, `customTrips`, `translations`) are the defaults. Pages init state from statics, then overwrite from Firestore only when the snapshot is non-empty and silently keep statics on error (see `Services.jsx`). Seed Firestore via `/admin/seed` (`setDoc` with stringified numeric ids).
- Booking wizard: `/booking` (`src/views/Booking.jsx`, 5 steps built from the `booking.*` translations; accepts `?service=tour&package=<id>`) ends by opening a WhatsApp deep link with the full request. Other CTAs still use WhatsApp links directly (`getWhatsAppLink`). Booking = WhatsApp deep links (`getWhatsAppLink` + `config.whatsapp.bookingMessage()` in `src/data/config.js`), not Firestore writes. The `bookings` collection is read by admin `Dashboard` + `Profile`/`Ticket`; guest state lives in `localStorage` (`guestBookings`, `guestProfile`, `guestSession`).
- `AuthContext`: Google + guest sessions; on login migrates guest `localStorage` into `users/{uid}` and touches `bookings/{reference}`.
- i18n: `id` default, `en` via `LanguageContext` (`t('a.b')`, `tr(id, en)`, `translations.js`, `localStorage` key `language`).
- Currency: IDR/USD/AUD with static rates in `CurrencyContext` (`formatPrice()` takes IDR; key `htb_currency`).
- Firebase client (`src/config/firebase.js`): `NEXT_PUBLIC_FIREBASE_*` env vars with hardcoded fallbacks; `initializeFirestore` with `experimentalForceLongPolling: true, useFetchStreams: false`; IndexedDB persistence commented out (was causing sync hangs — do not re-enable casually).
- Functions (`functions/index.js`): `onBookingCreate` (SendGrid), `createTransaction` + `paymentWebhook` (Midtrans Snap, `IS_PRODUCTION=false`). Keys via `functions:config` (`sendgrid.key`, `midtrans.server_key`).
- Styling is Tailwind v4 CSS-first: the real theme is the `@theme` block in `src/index.css` (primary bronze `#b8824d`/`#c4935f`, accent `#1a4d3e`, fonts Playfair Display + Plus Jakarta Sans, dark mode via `@custom-variant`). `tailwind.config.js` (green palette, Inter) is stale — do not trust it.
- Contexts must not read `localStorage` during initial render (static HTML is prerendered); load saved language/theme/currency in `useEffect`.

## Gotchas

- Firestore rules: public read on `packages`/`posts`/`fleet`/`reviews` and `bookings` (read is world-open — never store secrets there); `bookings` create requires `fullName` string longer than 2 chars; update/delete admin-only via `admins/{uid}` doc. Storage rules instead check `token.email == 'haditransbali@gmail.com'` — inconsistent with Firestore's uid check; don't "fix" one side alone.
- `/admin` has a client-side email guard (`ADMIN_EMAILS`, redirects non-users, "Access Denied" otherwise); `/admin/seed` has no guard at all. Real enforcement is Firestore rules only.
- `src/data/config.js` has bank details and WA numbers but no API keys any more: `AiPlanner` answers from its built-in offline brain (no LLM call from the browser). The previously exposed OpenAI/Gemini/Mistral keys must be rotated; add any future LLM behind a Cloud Function with rate limiting, never in client code.
- `.env.example` holds empty placeholders only; keep real values in `.env` (gitignored).
- `src/hooks/` is empty; there is no `useMidtrans` — don't reference it. The site is bilingual for visitor accessibility (ID default, EN via the navbar switch; use `tr('indonesia','english')` from `useLanguage()` for inline text). That is separate from Hadi's own English ability: never claim the driver/team speaks English, and keep WhatsApp messages sent to Hadi in Indonesian. No user login; only `/admin` signs in with Google.
- ESLint `no-unused-vars` ignores `^[A-Z_]|motion` (framer-motion convention).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
