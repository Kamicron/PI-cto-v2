<template>
  <div class="top-bar">
    <Alert ref="alertRef" />

    <div class="top-bar__auth">
      <template v-if="!authStore.isLoggedIn">
        <form style="display: flex; gap:10px" @submit.prevent="login">
          <input v-model="credentials.username" type="text" placeholder="Nom d'utilisateur" />
          <input v-model="credentials.password" type="password" placeholder="Mot de passe" />
          <pi-button type="submit" tiny bg-color="#2c3b4c" label="Connexion" icon="fa-solid fa-user-shield"/>
          <!-- <button type="submit">Se connecter</button> -->
        </form>
        <p v-if="error">{{ error }}</p>
      </template>
      <template v-else>
        <span>Bienvenue, {{ authStore.username }}</span>
        <pi-button @click="logout" tiny bg-color="#2c3b4c" label="Déconnexion" :icon="['fas', 'power-off']"/>

      </template>
    </div>
  </div>
</template>

<script setup lang='ts'>
// ----- Import -----
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '../../stores/auth';
// ------------------

// ------ Type ------

// ------------------

// ----- Define -----

// ------------------

// ------ Const -----
const authStore = useAuthStore();
const router = useRouter();
// ------------------

// ---- Reactive ----
const credentials = ref({ username: "", password: "" });
const error = ref("");
const alertRef = ref(null);
// ------------------

// ---- Computed ----

// ------------------

// ------ Hooks -----

// ------------------

// --- Async Func ---
const login = async () => {
  try {
    showMessageAlert('info', 'Chargement...')
    await authStore.login(credentials.value);
    showMessageAlert('success', 'Connexion réussis')
    router.push('/folder/495e09c7-e09d-481e-9c29-ae62e58fc25b')

  } catch (e) {
    showMessageAlert('error', 'identifiant, ou mot de passe incorrect')
  }
};


// ------------------

// ---- Function ----
const logout = () => {
  authStore.logout();
  showMessageAlert('success', 'Déconnexion réussis')
  router.push('/')

};

function showMessageAlert(status: 'success' | 'error' | 'info' | 'warning', message: string) {
  alertRef.value?.addMessage(status, message);
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