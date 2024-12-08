import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, // Réactif
    username: '',
    token: '',
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      const { $api } = useNuxtApp();
      const { data } = await $api.post('/auth/login', credentials);

      this.token = data.access_token;
      this.username = credentials.username;
      this.isLoggedIn = true;

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', credentials.username);
    },
    logout() {
      this.token = '';
      this.username = '';
      this.isLoggedIn = false;

      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
    async fetchAuthStatus() {
      const token = process.client ? localStorage.getItem('token') : null;
      if (token) {
        this.token = token;
        this.username = localStorage.getItem('username') || '';
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },
  },
});
