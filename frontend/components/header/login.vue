<template>
  <div class="top-bar">
    <h1 class="top-bar__title">PI-cto</h1>
    <div class="top-bar__auth">
      <template v-if="!authStore.isLoggedIn">
        <form @submit.prevent="login">
          <input v-model="credentials.username" type="text" placeholder="Nom d'utilisateur" />
          <input v-model="credentials.password" type="password" placeholder="Mot de passe" />
          <button type="submit">Se connecter</button>
        </form>
        <p v-if="error">{{ error }}</p>
      </template>
      <template v-else>
        <span>Bienvenue, {{ authStore.username }}</span>
        <button @click="logout">Se déconnecter</button>
      </template>
    </div>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref } from "vue";
import { useAuthStore } from '../../stores/auth';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const authStore = useAuthStore();
// ------------------

// ---- Reactive ----
const credentials = ref({ username: "", password: "" });
const error = ref("");
// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---
const login = async () => {
  try {
    await authStore.login(credentials.value);
  } catch (e) {
    error.value = 'Nom d’utilisateur ou mot de passe incorrect.';
  }
};


// ------------------

// ---- Function ----
const logout = () => {
  authStore.logout();
};
// ------------------

// ------ Watch -----

// ------------------

</script>

<style lang="scss" scoped>
.top-bar {
  background-color: $primary-color;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &__auth {
    display: flex;
    align-items: center;
  }

  &__login-form {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__input {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
  }

  &__button {
    padding: 5px 10px;
    background-color: white;
    color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: #0056b3;
      color: white;
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__error {
    color: red;
    margin-top: 5px;
  }
}
</style>