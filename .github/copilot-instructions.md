# Copilot instructions for PinKeeper project

Use TypeScript for writing codes.

Use pnpm for managing Javascript dependencies, so if you need to install a package, use `pnpm add`.

Use wxt as the browser extension framework. Use `browser` for all browser extension APIs, not `chrome`.

Use React 19 as the frontend framework.

Use @shadcn/ui for reusable UI components, so when creating a new component, use the shadcn CLI `pnpm dlx shadcn@latest add [component]`. Check `src/components/ui` for existing components.

Extension's setting page is located at `src/entrypoints/options/App.tsx`.

Manage extension's settings using `wxt/storage` API, place all settings in `src\utils\storage.ts`.

Never use `any` type and always use explicit types.
