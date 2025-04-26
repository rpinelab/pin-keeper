# PinKeeper

> Automatically manage and restore pinned tabs with flexible URL matching rules

![PinKeeper Icon](src/assets/icon.png)

PinKeeper is a browser extension that helps you maintain consistent pinned tabs across browsing sessions.

## Features

- Automatically restore pinned tabs when the browser is restarted.
- Flexible URL matching rules to determine which tabs should be restored.
- Customizable tab order via drag-and-drop.
- Pattern testing to ensure your rules work as expected.
- Customizable startup delay (default: 100 ms).

## Technology Stack

- Programming Language: [TypeScript](https://www.typescriptlang.org/)
- Package Management: [pnpm](https://pnpm.io/)
- Browser Extension Framework: [WXT](https://wxt.dev/)
- Frontend Framework: [React](https://react.dev/)
- UI Components: [@shadcn/ui](https://ui.shadcn.com/)

## Development

Install dependencies:

```bash
pnpm install
```

### Running in Development Mode

To start the development server:

```bash
pnpm run dev # To run Firefox: pnpm run dev:firefox
```

### Packaging the Extension

To build and package the extension:

```bash
pnpm run zip # For Firefox: pnpm run zip:firefox
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
