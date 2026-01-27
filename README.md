# Pin Keeper

<img src="src/assets/icon.png" alt="Pin Keeper browser extension logo" width="128" />

> Never lose your essential pinned tabs again. Automatically restore them on browser startup with smart URL matching.

Pin Keeper is a browser extension built with [WXT](https://wxt.dev/) and React.
It stores your pinned tab configuration locally and automatically brings it back on startup, even if the browser crashes or tabs are accidentally closed.

## ✨ Features

- **Auto-restore on startup** - Pinned tabs automatically restore when browser starts
- **Smart duplicate detection** - Skips tabs that are already open
- **Flexible URL matching** - Four modes: Exact, Starts With, Domain Match, and Regex
- **Drag-and-drop ordering** - Arrange tabs in your preferred order
- **Manual restore** - Click toolbar icon to restore tabs anytime
- **Pattern testing** - Verify URL rules before saving

## 🚀 Quick Start

1. Install the extension
2. Pin some tabs in your browser
3. Right-click the extension icon and go to the extension's option page
4. Add URL patterns for tabs you want to protect (e.g., `https://mail.google.com/`)
5. Now they'll auto-restore if accidentally closed or browser crashes

**Tip:** Click the extension icon anytime to manually restore tabs

## 📖 URL Matching Modes

Choose the matching mode that fits your needs:

| Mode | Example | Use Case |
|------|---------|----------|
| **Exact** | `https://github.com/notifications` | Static URLs that never change |
| **Starts With** | `https://github.com/` | URLs with dynamic paths and query parameters |
| **Domain Match** | `https://mail.google.com/mail/u/1/#inbox` | Match all URLs with the same hostname (ignores protocol, path, query, hash) |
| **Regex** | `https://github\.com/(notifications\|settings)` | Complex matching patterns |

**Tip:** Use the built-in pattern tester to validate URL rules before saving.

### Example: Gmail with Multiple Accounts

If you use multiple Gmail accounts (e.g., `/mail/u/0/`, `/mail/u/1/`, `/mail/u/2/`), use **Domain Match** mode with URL `https://mail.google.com/mail/u/1/#inbox`. This will match any tab on `mail.google.com`, regardless of which account or section you're in.

**Domain Match** compares only the hostname, so:
- ✅ Matches: `https://mail.google.com/mail/u/2/#sent`
- ✅ Matches: `http://mail.google.com/`
- ❌ Does not match: `https://www.google.com` (different subdomain)
- ❌ Does not match: `https://google.com` (different domain)

**Note:** Ports are ignored in domain matching (e.g., `localhost:3000` and `localhost:8080` both match as `localhost`).

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Setup

```bash
git clone https://github.com/rpinelab/pin-keeper.git
cd pin-keeper
pnpm install
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server for Chrome |
| `pnpm run dev:firefox` | Start development server for Firefox |
| `pnpm run build` | Build extension for Chrome |
| `pnpm run build:firefox` | Build extension for Firefox |
| `pnpm run zip` | Package Chrome extension |
| `pnpm run zip:firefox` | Package Firefox extension |
| `pnpm run lint` | Run Biome linter |
| `pnpm run check` | Run Biome check and auto-fix |
| `pnpm run compile` | Type-check with TypeScript |
| `pnpm run test` | Run tests with Vitest |

### Development Workflow

1. **Start the dev mode browser with the extension**

   ```bash
   pnpm run dev
   # or for Firefox:
   pnpm run dev:firefox
   ```

2. **Make changes**: The extension will automatically reload when you save files

3. **Run tests and linting**:

   ```bash
   pnpm run test
   pnpm run lint
   pnpm run compile
   ```

### Packaging the extension

```bash
# For Chrome
pnpm run zip

# For Firefox
pnpm run zip:firefox
```

The packaged extensions will be in the `.output` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
