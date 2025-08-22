# VS Code Development Guide for InfoHub

This guide will help you set up and use Visual Studio Code effectively for developing the InfoHub project.

## Table of Contents
- [Initial Setup](#initial-setup)
- [Opening the Project](#opening-the-project)
- [Recommended Extensions](#recommended-extensions)
- [Development Workflow](#development-workflow)
- [Debugging](#debugging)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips and Tricks](#tips-and-tricks)
- [Troubleshooting](#troubleshooting)

## Initial Setup

### Prerequisites
1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **pnpm** - Install globally: `npm install -g pnpm`
3. **VS Code** - [Download](https://code.visualstudio.com/)

### Project Structure Understanding
```
infohub/
├── .vscode/              # VS Code workspace configuration
├── src/
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── pages/           # Application pages
│   │   └── Admin/       # Admin dashboard pages
│   ├── contexts/        # React contexts
│   ├── lib/             # Utility libraries
│   └── App.tsx          # Main app component
├── public/              # Static assets
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## Opening the Project

### Method 1: From Command Line
```bash
git clone https://github.com/alokkrnarzay/infohub.git
cd infohub
code .
```

### Method 2: In VS Code
1. `Ctrl+Shift+P` → "Git: Clone"
2. Enter: `https://github.com/alokkrnarzay/infohub.git`
3. Choose folder and open

### Method 3: File Menu
1. File → Open Folder
2. Navigate to cloned repository folder

## Recommended Extensions

When you open the project, VS Code will automatically suggest installing recommended extensions. Here's what each one does:

### Essential Extensions
- **TypeScript and JavaScript Language Features**: Enhanced IntelliSense
- **Prettier**: Automatic code formatting
- **ESLint**: Code linting and error detection
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes

### React Development
- **React JavaScript Snippets**: Useful React code snippets
- **Auto Rename Tag**: Rename paired HTML/JSX tags

### Productivity
- **Path Intellisense**: File path autocomplete
- **GitLens**: Enhanced Git integration
- **Error Lens**: Inline error highlighting

## Development Workflow

### 1. Install Dependencies
```bash
pnpm install
```
Or use VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "Install Dependencies"

### 2. Start Development Server
```bash
pnpm run dev
```
Or use VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "pnpm: dev"

### 3. Available Scripts
- `pnpm run dev` - Start development server (http://localhost:5173)
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

### 4. Code Organization
- Use the `@/` alias for imports from `src/`: `import { Button } from '@/components/ui/button'`
- Follow the existing file structure
- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/lib/`

## Debugging

### Browser Debugging
1. Start dev server: `pnpm run dev`
2. Press `F5` or go to Run and Debug panel
3. Select "Launch Chrome" or "Launch Edge"
4. Set breakpoints in your React components

### TypeScript Debugging
- Hover over variables to see types
- `Ctrl+Click` on imports to navigate to definitions
- Use `Ctrl+Shift+O` to navigate symbols in file

## Keyboard Shortcuts

### Essential Shortcuts
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+P` - Quick Open files
- `Ctrl+Shift+F` - Find in files
- `Ctrl+`` - Toggle terminal
- `F5` - Start debugging
- `Ctrl+Shift+\`` - Create new terminal

### Code Navigation
- `Ctrl+G` - Go to line
- `Ctrl+Shift+O` - Go to symbol
- `F12` - Go to definition
- `Alt+F12` - Peek definition
- `Shift+F12` - Find all references

### Code Editing
- `Alt+↑/↓` - Move line up/down
- `Shift+Alt+↓` - Copy line down
- `Ctrl+Shift+K` - Delete line
- `Ctrl+/` - Toggle comment
- `Shift+Alt+F` - Format document

## Tips and Tricks

### IntelliSense Features
- **Auto-imports**: TypeScript will automatically suggest and add imports
- **Path completion**: Type `@/` to get autocomplete for src folder
- **Tailwind classes**: Get autocomplete for CSS classes
- **Component props**: See available props when using React components

### Code Formatting
- **Format on Save**: Enabled automatically with Prettier
- **ESLint Auto-fix**: Runs automatically on save
- **Organize Imports**: `Shift+Alt+O`

### Terminal Integration
- Multiple terminals: Click `+` in terminal panel
- Split terminal: Click split icon
- Terminal shortcuts: `Ctrl+\`` to toggle, `Ctrl+Shift+\`` for new

### Git Integration
- Source Control panel: `Ctrl+Shift+G`
- Stage changes: Click `+` next to files
- Commit: `Ctrl+Enter` in commit message box
- GitLens: See git history and blame information inline

### Workspace Features
- **File Nesting**: Related files are grouped (e.g., .ts and .js files)
- **Explorer**: Enhanced file tree with git status
- **Breadcrumbs**: Navigate file hierarchy at top of editor

## Troubleshooting

### Common Issues

#### TypeScript not working
1. Open any `.ts` file
2. `Ctrl+Shift+P` → "TypeScript: Select TypeScript Version"
3. Choose "Use Workspace Version"

#### Import paths not resolving
- Check if `tsconfig.json` has the `@/*` path mapping
- Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

#### Tailwind autocomplete not working
1. Install "Tailwind CSS IntelliSense" extension
2. Restart VS Code
3. Check if `tailwind.config.ts` exists in project root

#### ESLint not running
1. Check if ESLint extension is enabled
2. Look for ESLint output in Output panel
3. Run `pnpm run lint` in terminal to test

#### Prettier not formatting
1. Check if Prettier extension is installed
2. Right-click in editor → "Format Document With..." → Choose Prettier
3. Check if `.prettierrc` file exists

### Performance Tips
- **Exclude large folders**: Add to `.gitignore` and VS Code will ignore them
- **Close unused tabs**: Use "Close Others" or "Close All"
- **Disable unused extensions**: Go to Extensions panel and disable what you don't need

### Getting Help
- **Command Palette**: `Ctrl+Shift+P` and type what you want to do
- **Settings**: `Ctrl+,` to open settings
- **Problems Panel**: `Ctrl+Shift+M` to see errors and warnings
- **Output Panel**: See logs from extensions and tools

## Project-Specific Configuration

This project includes pre-configured VS Code settings for:
- TypeScript/React development
- Tailwind CSS support
- ESLint and Prettier integration
- Debugging configurations
- Custom tasks for pnpm scripts
- Path intellisense with `@/` alias

The configuration files are in `.vscode/`:
- `settings.json` - Workspace settings
- `extensions.json` - Recommended extensions
- `launch.json` - Debug configurations
- `tasks.json` - Build and development tasks

## Next Steps

1. Open the project in VS Code
2. Install recommended extensions when prompted
3. Run `pnpm install` in the terminal
4. Start development with `pnpm run dev`
5. Open `http://localhost:5173` in your browser
6. Start coding! 🚀

Happy coding with InfoHub! If you encounter any issues, check the troubleshooting section or refer to the main README.md file.