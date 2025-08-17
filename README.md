# Pin Keeper - Smart Pinned Tab Manager

> Automatically restore and manage your pinned tabs with intelligent URL matching and flexible configuration options.

![PinKeeper Icon](src/assets/icon.png)

## Overview

Pin Keeper is a powerful browser extension that solves one of the most frustrating browsing problems: losing your carefully organized pinned tabs when your browser restarts or crashes. Whether you're a developer who keeps documentation open, a researcher with multiple reference sites, or someone who relies on specific web apps throughout the day, Pin Keeper ensures your essential tabs are always there when you need them.

## ✨ Key Features

### 🔄 **Automatic Tab Restoration**

- Automatically restores your pinned tabs on browser startup
- Manual restoration via toolbar button click
- Configurable startup delay to ensure proper browser initialization

### 🎯 **Intelligent URL Matching**

- Three matching modes: Exact Match, Starts With, and Regex
- Handle dynamic URLs with flexible pattern rules
- Smart detection prevents duplicate tabs

### 🎨 **Intuitive Management**

- **Drag-and-drop reordering**: Organize your tabs exactly how you want them
- **Visual configuration interface**: Easy-to-use settings panel
- **Pattern testing**: Verify your URL rules work before saving

## 📖 How to Use

### Configuring URL Patterns

Pin Keeper supports three flexible URL matching modes:

- **Exact Match**: `https://github.com/notifications` (matches the URL exactly)
- **Starts With**: `https://github.com/` (matches any URL that starts with this pattern)
- **Regex**: `https://github\.com/(notifications|settings)` (matches URLs using regular expressions)

#### Real-World Example: Gmail

Gmail is a perfect example of why flexible URL matching is essential. When you have Gmail pinned and navigate through your emails, the URL changes dynamically:

- **Initial Gmail URL**: `https://mail.google.com/mail/u/0/#inbox`
- **When opening an email**: `https://mail.google.com/mail/u/0/#inbox/FMfcgzQXKKPLXKpWHKJgTWBmKvbQHHPs`
- **When composing**: `https://mail.google.com/mail/u/0/#inbox?compose=new`

**Solution**: Use the pattern `https://mail.google.com/mail/u/0/` (`Starts With` matching mode) to match all Gmail states, ensuring your pinned Gmail tab is always restored regardless of which email or folder you were viewing.

### Managing Your Tabs

1. **Reorder tabs**: Drag and drop URLs in the settings to change their restoration order
2. **Test patterns**: Use the pattern testing feature to ensure your rules work correctly
3. **Enable/disable auto-restore**: Toggle automatic restoration on browser startup
4. **Adjust timing**: Set the startup delay to prevent conflicts with other extensions

### Manual Restoration

- Click the Pin Keeper icon in your browser toolbar anytime to manually restore your pinned tabs
- Useful for testing your configuration or when you accidentally close pinned tabs

## ⚙️ Configuration Options

- **Auto-restore on startup**: Enable/disable automatic tab restoration when browser starts
- **Startup delay**: Adjust the delay before restoration (default: 100ms)
- **URL patterns**: Flexible matching rules for your pinned tabs
- **Tab ordering**: Drag-and-drop to set the order of restored tabs

## Technology Stack

- Language: [TypeScript](https://www.typescriptlang.org/)
- Package Management: [pnpm](https://pnpm.io/)
- Browser Extension Framework: [WXT](https://wxt.dev/)
- Frontend Framework: [React](https://react.dev/)
- UI Components: [@shadcn/ui](https://ui.shadcn.com/)

## 🛠️ Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rpinelab/pin-keeper.git
   cd pin-keeper
   ```

2. **Install dependencies**:

   ```bash
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

### Building for Production

```bash
# For Chrome
pnpm run zip

# For Firefox
pnpm run zip:firefox
```

The packaged extensions will be in the `.output` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
