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

| Mode | Example URL | Use Case |
|------|-------------|----------|
| **Exact** | `https://github.com/notifications` | Static URLs that never change |
| **Starts With** | `https://docs.google.com/spreadsheets/` | URLs sharing a common path prefix |
| **Domain Match** | `https://mail.google.com/mail/u/0/#inbox` | Match all URLs with the same hostname (ignores protocol, path, query, hash) |
| **Regex** | `https://trello\.com/b/(abc123\|def456)` | Complex matching patterns |

**Tip:** Use the built-in pattern tester to validate URL rules before saving.

### Example 1: Gmail (Single Account)

If you use a single Gmail account, use **Domain Match** mode:

| Mode | URL | Match Pattern |
|------|-----|---------------|
| Domain Match | `https://mail.google.com/mail/u/0/#inbox` | _(empty)_ |

When Match Pattern is empty, the URL is used for matching. On restore, the inbox page will open. Domain Match will then match any tab on `mail.google.com`, regardless of the path or section you're in.

- ✅ Matches: `https://mail.google.com/mail/u/0/#inbox`
- ✅ Matches: `https://mail.google.com/mail/u/0/#sent`
- ❌ Does not match: `https://www.google.com` (different subdomain)
- ❌ Does not match: `https://google.com` (different domain)

**Note:** Ports are ignored in domain matching (e.g., `localhost:3000` and `localhost:8080` both match as `localhost`).

### Example 2: Gmail (Multiple Accounts)

If you use multiple Gmail accounts, use **Starts With** mode with a separate entry for each account:

| Mode | URL | Match Pattern |
|------|-----|---------------|
| Starts With | `https://mail.google.com/mail/u/0/#inbox` | `https://mail.google.com/mail/u/0/` |
| Starts With | `https://mail.google.com/mail/u/1/#inbox` | `https://mail.google.com/mail/u/1/` |
| Starts With | `https://mail.google.com/mail/u/2/#inbox` | `https://mail.google.com/mail/u/2/` |

Each entry restores its own pinned tab, so you can keep multiple Gmail accounts pinned side by side. The **URL** is the page opened on restore (e.g., inbox), while the **Match Pattern** matches any page within that account (e.g., sent, drafts).

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
| `pnpm run typecheck` | Type-check with TypeScript |
| `pnpm run test` | Run tests with Vitest |

### Development Workflow

1. **Start the dev mode browser with the extension**

   ```bash
   pnpm run dev
   # or for Firefox:
   pnpm run dev:firefox
   ```

2. **Make changes**: The extension will automatically reload when you save files

3. **Run code quality checks**

   ```bash
   pnpm run lint
   pnpm run typecheck
   pnpm run test
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
