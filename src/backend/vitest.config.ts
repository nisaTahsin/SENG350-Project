import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/frontend/**',
      '**/group_2_proj/group_2_proj/**',
    ],
    globals: true,
  },
});
