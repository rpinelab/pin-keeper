import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  test: {
    mockReset: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: ['wxt'],
      },
    },
  },
  plugins: [WxtVitest()],
});
