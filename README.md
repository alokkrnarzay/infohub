# InfoHub

A React + TypeScript + Vite application using shadcn/ui and Tailwind CSS. Includes an Admin Dashboard with content management (Links, Events, Scholarships, Comments), a Payments manager to configure a donation link, and public pages for Jobs, Education, Events, Scholarships, Resources, Support, Donate, Privacy, and Terms.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/alokkrnarzay/infohub.git
cd infohub

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Then open `http://localhost:5173` in your browser.

**For VS Code users**: Open the project folder in VS Code and install the recommended extensions when prompted for the best development experience.

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

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

### Opening the Project in VS Code

#### Method 1: Command Line
1. Open terminal/command prompt
2. Navigate to your desired directory
3. Clone the repository:
   ```bash
   git clone https://github.com/alokkrnarzay/infohub.git
   cd infohub
   ```
4. Open in VS Code:
   ```bash
   code .
   ```

#### Method 2: VS Code Interface
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open Command Palette
3. Type "Git: Clone" and select it
4. Enter the repository URL: `https://github.com/alokkrnarzay/infohub.git`
5. Choose a local folder and VS Code will open the project automatically

#### Method 3: GitHub Desktop
1. Open the [repository on GitHub](https://github.com/alokkrnarzay/infohub)
2. Click the green "Code" button
3. Select "Open with GitHub Desktop"
4. After cloning, click "Open in Visual Studio Code"

### VS Code Setup

#### Recommended Extensions
When you open the project in VS Code, you'll be prompted to install recommended extensions. Click "Install" to get:

- **TypeScript/JavaScript Support**: Enhanced IntelliSense and debugging
- **Prettier**: Code formatting
- **ESLint**: Code linting and error detection
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **React Snippets**: Useful React code snippets
- **GitLens**: Enhanced Git integration
- **Auto Rename Tag**: Automatically rename paired HTML/JSX tags

#### Development Workflow
1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for production**:
   ```bash
   pnpm run build
   ```

4. **Run linting**:
   ```bash
   pnpm run lint
   ```

### VS Code Features Available

#### Integrated Terminal
- Press `Ctrl+` ` (backtick) to open terminal
- Run all pnpm commands directly in VS Code

#### Debugging
- Press `F5` to start debugging
- Set breakpoints in your React components
- Debug configurations are pre-configured for Chrome and Edge

#### Task Runner
- Press `Ctrl+Shift+P` → "Tasks: Run Task" to run:
  - `pnpm: dev` - Start development server
  - `pnpm: build` - Build for production  
  - `pnpm: lint` - Run ESLint
  - `Install Dependencies` - Run pnpm install

#### IntelliSense Features
- Auto-completion for React components, TypeScript, and Tailwind classes
- Import suggestions and auto-imports
- Path intellisense with `@/` alias support
- Error highlighting and quick fixes

#### Code Formatting
- Auto-format on save (enabled by default)
- Prettier integration for consistent code style
- ESLint auto-fix on save

### Troubleshooting

#### If pnpm is not installed:
```bash
npm install -g pnpm
```

#### If VS Code doesn't recognize TypeScript:
1. Open any `.ts` or `.tsx` file
2. Press `Ctrl+Shift+P`
3. Type "TypeScript: Select TypeScript Version"
4. Choose "Use Workspace Version"

#### If Tailwind classes don't show autocomplete:
1. Install the "Tailwind CSS IntelliSense" extension
2. Restart VS Code
3. Open a component file with Tailwind classes

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
