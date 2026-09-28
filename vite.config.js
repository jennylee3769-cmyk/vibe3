import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        list: 'list/index.html',
        signup: 'signup/index.html',
        login: 'login/index.html',
        new: 'new/index.html',
        mypage: 'mypage/index.html',
        detail: 'detail/index.html',
        slides: 'slides.html',
      },
    },
  },
});
