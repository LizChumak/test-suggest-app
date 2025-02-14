import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

export default defineConfig({
  base: '/test-suggest-app/',
  plugins: [createVuePlugin()],
});