import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        list: 'list/index.html',
        slides: 'slides.html',
      },
    },
  },
});
