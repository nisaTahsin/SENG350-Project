cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['**/*.test.{ts,tsx}'],
    css: true,
    globals: true
  },
});
EOF
