# InfoHub

A React + TypeScript + Vite application using shadcn/ui and Tailwind CSS. Includes an Admin Dashboard with content management (Links, Events, Scholarships, Comments), a Payments manager to configure a donation link, and public pages for Jobs, Education, Events, Scholarships, Resources, Support, Donate, Privacy, and Terms.

## Technology Stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

All shadcn/ui components are available under `@/components/ui`.

## File Structure (key files)
- `index.html` – HTML entry point
- `vite.config.ts` – Vite configuration
- `tailwind.config.ts` – Tailwind configuration
- `package.json` – dependencies and scripts
- `src/App.tsx` – application routing and layout
- `src/main.tsx` – app bootstrap
- `src/index.css` – global styles
- `src/pages` – pages (Home, Jobs, Education, Events, Scholarships, Resources, Support, Donate, Privacy, Terms)
- `src/pages/Admin` – admin dashboard and managers (Links, Events, Scholarships, Comments, Payment)

## Development
Install dependencies and start the dev server.

```bash
pnpm install
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

## Admin Access
- Admin Dashboard is protected and accessible at `/admin` after login.
- Default admin credentials (mock):
  - username: `adminalokkrnrazary`
  - password: `Alokinfohub@2000005`

## Payments
- Admin can configure a payment link in Admin → Payments.
- Donate page uses the admin-configured URL if active, otherwise defaults to Cashfree: `https://payments.cashfree.com/forms/akny`.
- Support → Contact shows a "Pay Now" button with the same logic.

## Notes
- Data persistence is implemented via `localStorage` for demo purposes. For production, replace with secure server-side APIs and databases.
- Path alias `@/` maps to `src/`.

## Upstash KV
This project supports client-side Upstash KV as an optional remote key-value store. The helper is implemented in `src/lib/upstash.ts` and the app will prefer Upstash when the required environment variables are set.

To enable Upstash KV:
1. Create an Upstash Redis instance (or use an existing one). The example instance name used in this repo is `upstash-kv-rose-park`.
2. Add the REST URL and REST token to your environment (see `.env.example`). Example variables:

```
VITE_UPSTASH_REST_URL=https://<your-instance>.rest.upstash.io
VITE_UPSTASH_REST_TOKEN=<your-rest-token>
```

3. Restart the dev server. The app will read the variables via `import.meta.env` and use Upstash for remote persistence (used by `useLocalStorage` hook).

Notes:
- When Upstash is configured, the app will treat the remote store as the source-of-truth and will not persist locally to `localStorage` for keys managed remotely.
- Keep your tokens secret; do not commit real tokens to the repo.
