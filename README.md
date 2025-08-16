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
