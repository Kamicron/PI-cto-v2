<template>
  <div class="top-bar">
    <!-- <Alert ref="alertRef" /> -->

    <div class="top-bar__auth">
      <template v-if="!authStore.isLoggedIn">
        <form style="display: flex; gap:10px" @submit.prevent="login">
          <input v-model="credentials.username" type="text" placeholder="Nom d'utilisateur" />
          <input v-model="credentials.password" type="password" placeholder="Mot de passe" />
          <pi-button type="submit" tiny bg-color="#2c3b4c" label="Connexion" icon="fa-solid fa-user-shield" />
          <!-- <button type="submit">Se connecter</button> -->
        </form>
        <p v-if="error">{{ error }}</p>
      </template>
      <template v-else>
        <span>Bienvenue, {{ authStore.username }}</span>
        <pi-button @click="logout" tiny bg-color="#2c3b4c" label="Déconnexion" :icon="['fas', 'power-off']" />

      </template>
    </div>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '../../stores/auth';
import { EToast } from "vue3-modern-toast";
import { useAxiosError } from '../../composables/useAxiosError';

// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const authStore = useAuthStore();
const router = useRouter();
const { getErrorMessage } = useAxiosError();
const { $toast } = useNuxtApp()
// ------------------

// ---- Reactive ----
const credentials = ref({ username: "", password: "" });
const error = ref("");
// const alertRef = ref(null);

// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---
const login = async () => {
  try {
    $toast.show({
      message: 'Chargement...',
      type: EToast.INFO,
      duration: 3000,
      dismissible: true,
      icon: '🔄'
    })
    await authStore.login(credentials.value);
    $toast.show({
      message: 'Connexion réussis',
      type: EToast.SUCCESS,
      duration: 3000,
      dismissible: true,
      icon: '✨'
    })
    router.push('/folder/6c94b799-0dd9-46f6-b503-d8e9bf651916')

  } catch (e) {
    $toast.show({
      message: getErrorMessage(e),
      type: EToast.ERROR,
      duration: 3000,
      dismissible: true,
      icon: '⛔'
    })
  }
};


// ------------------

// ---- Function ----
const logout = () => {
  authStore.logout();
  $toast.show({
    message: 'Déconnexion réussis',
    type: EToast.SUCCESS,
    duration: 3000,
    dismissible: true,
    icon: '✨'
  })
  router.push('/')
};

// ------------------

// ------ Watch -----

// ------------------

</script>

<style lang="scss" scoped>
.top-bar {
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