import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Pin Keeper - Smart Pinned Tab Manager',
    permissions: ['notifications', 'storage', 'tabs'],
    action: {},
  },
  extensionApi: 'chrome',
  srcDir: 'src',
  imports: false,
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
