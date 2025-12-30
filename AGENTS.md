# AGENTS.md

## Project Overview

Pin Keeper is a browser extension that automatically restores and manages pinned tabs with intelligent URL matching. Built with WXT framework for Chrome and Firefox, it uses React for the UI and TypeScript throughout.

## Technology Stack

See `package.json` for specific version requirements (`engines` and `packageManager` fields).

- **Framework**: WXT (browser extension framework)
- **Package Manager**: pnpm
- **Runtime**: Node.js
- **Frontend**: React
- **UI Components**: shadcn/ui (located in `src/components/ui/`)
- **Styling**: Tailwind CSS
- **Linter/Formatter**: Biome
- **Testing**: Vitest with WxtVitest plugin
- **Type Checking**: TypeScript

## Development Commands

### Running the Extension

- `pnpm run dev` - Start development mode for Chrome (opens browser with extension loaded)
- `pnpm run dev:firefox` - Start development mode for Firefox

### Building & Packaging

- `pnpm run build` - Build for Chrome
- `pnpm run build:firefox` - Build for Firefox
- `pnpm run zip` - Package Chrome extension (output in `.output/`)
- `pnpm run zip:firefox` - Package Firefox extension

### Code Quality

- `pnpm run test` - Run tests with Vitest
- `pnpm run lint` - Check linting issues
- `pnpm run check` - Auto-fix linting and formatting issues
- `pnpm run compile` - Type-check without emitting files

## Architecture

### Entry Points (`src/entrypoints/`)

- **background.ts**: Background script handling toolbar clicks and startup restoration
- **options/**: Extension settings page (React app)

### Core Modules

#### Storage (`src/utils/storage.ts`)

All extension settings use WXT's storage API. Storage items are defined using `storage.defineItem()` with versioning support. Main settings include:

- URL configurations with matching rules
- Startup delay configuration
- Auto-restore toggle

#### Tab Management (`src/utils/tabManager.ts`)

Core logic for tab restoration. Key functionality:

- Main restoration function that checks existing tabs before creating new ones
- URL matching factory supporting multiple matching strategies (exact, prefix, pattern-based)
- Helper to capture currently pinned tabs and add to settings

#### React Hooks (`src/hooks/`)

Custom hooks for reactive storage access. Each hook syncs with a specific storage item (pinned URL settings, auto-restore toggle, startup delay). A generic base hook handles WXT storage integration.

### UI Components

#### shadcn/ui (`src/components/ui/`)

Pre-built components excluded from Biome checks. To add new components:

```bash
pnpm dlx shadcn@latest add [component]
```

## Code Conventions

### Browser Extension APIs

**CRITICAL**: Always use `browser` namespace, never `chrome`:

```typescript
import { browser } from 'wxt/browser';
// ✅ Correct
browser.tabs.query({ pinned: true });
// ❌ Wrong
chrome.tabs.query({ pinned: true });
```

### TypeScript

- Never use `any` type - use explicit types or `unknown`
- Prefer `??` over `||` for nullish coalescing
- TypeScript extends WXT's generated config (`.wxt/tsconfig.json`)

### Storage Management

All settings must be in `src/utils/storage.ts` using WXT's `storage.defineItem()` pattern with versioning support.

### Code Style (Biome)

- Indent: 2 spaces
- Line width: 80 characters
- Quotes: Single quotes (JS/TS), single quotes (JSX)
- Semicolons: Always
- Line ending: LF
- Import organization: Auto-enabled via `biome check`

Files in `src/components/ui/` are excluded from Biome checks (shadcn-generated).

## Testing

- Framework: Vitest with WxtVitest plugin
- Config: `vitest.config.ts`
- Test files: Located in `src/utils/__tests__/`
- Mocks: `mockReset` and `restoreMocks` enabled by default

## Git Workflow

- Pre-commit hook: Runs `lefthook` with Biome checks
- Staged files are automatically formatted via Biome before commit

## Important Notes

1. The extension settings page is at `src/entrypoints/options/App.tsx`
2. Tab restoration logic prevents duplicates by checking existing pinned tabs before creating new ones
3. URL matching patterns support dynamic URLs (e.g., Gmail's changing hash fragments)
4. WXT handles manifest generation and browser-specific builds automatically
5. Icons are auto-generated from `src/assets/icon.png` via `@wxt-dev/auto-icons`
