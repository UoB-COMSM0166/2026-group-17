import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./utils/p5Mock.js'],
    include: ['*.test.js'],
    restoreMocks: true,
    clearMocks: true,
  },
});
