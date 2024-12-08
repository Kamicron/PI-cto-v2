import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.fetchAuthStatus();

  // Rediriger si nécessaire
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return navigateTo('/login');
  }
});
