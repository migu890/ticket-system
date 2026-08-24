<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    await login({
      email: email.value,
      password: password.value
    })

    await router.push('/tickets')
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Login fehlgeschlagen'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <h1>Ticket System</h1>

      <p>
        Melde dich an, um deine Support-Tickets
        zu verwalten.
      </p>

      <form @submit.prevent="submit">
        <label for="email">
          E-Mail
        </label>

        <input
          id="email"
          v-model="email"
          type="email"
          required
        />

        <label for="password">
          Passwort
        </label>

        <input
          id="password"
          v-model="password"
          type="password"
          required
        />

        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
        >
          {{
            loading
              ? 'Anmeldung...'
              : 'Anmelden'
          }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background:
    linear-gradient(
      135deg,
      #eef2f7 0%,
      #dfe7f0 100%
    );
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 36px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 12px 35px
    rgba(15, 23, 42, 0.12);
  border:
    1px solid
    rgba(148, 163, 184, 0.25);
}

h1 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 2rem;
}

p {
  color: #64748b;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

label {
  font-weight: 600;
  color: #334155;
}

input {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.12);
  background: #ffffff;
}

button {
  margin-top: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 12px;
}
</style>