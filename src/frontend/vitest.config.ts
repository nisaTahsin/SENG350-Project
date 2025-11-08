import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,            // vitest will use the frontend folder as root
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,            // gives you describe/it/test/expect
    setupFiles: ['./src/setupTests.ts'],   // make sure this file exists
    include: ['tests/**/*.test.ts?(x)', 'src/**/*.test.ts?(x)'],
    css: true,
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
})
