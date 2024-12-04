<template>
  <header class='login'>
      <h1>Connexion</h1>
      <form @submit.prevent="login">
          <input v-model="credentials.username" type="text" placeholder="Nom d'utilisateur" />
          <input v-model="credentials.password" type="password" placeholder="Mot de passe" />
          <button type="submit">Se connecter</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
  </header>
</template>

<script setup lang='ts'>
// ----- Import -----
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const router = useRouter();
const { $api } = useNuxtApp();
// ------------------

// ---- Reactive ----
const credentials = ref({ username: '', password: '' });
const error = ref('');
// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---
const login = async () => {
try {
  const { data } = await $api.post('/auth/login', credentials.value);
  localStorage.setItem('token', data.access_token); // Stocke le token
  router.push('/'); // Redirige après la connexion
} catch (e) {
  error.value = 'Nom d’utilisateur ou mot de passe incorrect.';
}
};
// ------------------

// ---- Function ----

// ------------------

// ------ Watch -----

// ------------------

</script>

<style lang='scss' scoped>
.login {}
</style>