import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Pin Keeper - Smart Pinned Tab Manager',
    permissions: ['contextMenus', 'notifications', 'storage', 'tabs'],
    action: {},
    browser_specific_settings: {
      gecko: {
        id: '{d01a0cea-aa5d-4147-8536-d1b1e23766ba}',
        // @ts-expect-error data_collection_permissions is not yet in the wxt's type definitions
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
  srcDir: 'src',
  imports: false,
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
