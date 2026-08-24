<script setup lang="ts">
import {
  computed,
  ref,
  watch
} from 'vue'

import type {
  TicketDTO,
  TicketPriority
} from '@ticket-system/shared'

import {
  createTicket,
  updateTicket
} from '../api/ticketApi'

const props = defineProps<{
  ticket?: TicketDTO | null
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const title = ref('')
const description = ref('')

const priority =
  ref<TicketPriority>('MEDIUM')

const error = ref('')
const loading = ref(false)

const isEditMode = computed(
  () => props.ticket != null
)

const formTitle = computed(
  () =>
    isEditMode.value
      ? 'Ticket bearbeiten'
      : 'Ticket erstellen'
)

const submitLabel = computed(
  () =>
    isEditMode.value
      ? 'Speichern'
      : 'Erstellen'
)

const fillForm = () => {
  if (props.ticket) {
    title.value =
      props.ticket.title

    description.value =
      props.ticket.description

    priority.value =
      props.ticket.priority
  } else {
    title.value = ''
    description.value = ''
    priority.value = 'MEDIUM'
  }

  error.value = ''
}

watch(
  () => props.ticket,
  fillForm,
  {
    immediate: true
  }
)

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    const data = {
      title: title.value.trim(),
      description:
        description.value.trim(),
      priority: priority.value
    }

    if (props.ticket) {
      await updateTicket(
        props.ticket.id,
        data
      )
    } else {
      await createTicket(data)
    }

    emit('saved')
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Ticket konnte nicht gespeichert werden'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="dialog"
    @click.self="emit('cancel')"
  >
    <div class="dialog-content">
      <h2>
        {{ formTitle }}
      </h2>

      <form @submit.prevent="submit">
        <label for="title">
          Titel
        </label>

        <input
          id="title"
          v-model="title"
          type="text"
          required
          minlength="3"
          maxlength="255"
        />

        <label for="description">
          Beschreibung
        </label>

        <textarea
          id="description"
          v-model="description"
          required
          minlength="3"
        />

        <label for="priority">
          Priorität
        </label>

        <select
          id="priority"
          v-model="priority"
        >
          <option value="LOW">
            Tief
          </option>

          <option value="MEDIUM">
            Mittel
          </option>

          <option value="HIGH">
            Hoch
          </option>
        </select>

        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>

        <div class="buttons">
          <button
            type="submit"
            :disabled="loading"
          >
            {{
              loading
                ? 'Speichern...'
                : submitLabel
            }}
          </button>

          <button
            type="button"
            :disabled="loading"
            @click="emit('cancel')"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.35);
}

.dialog-content {
  width: 100%;
  max-width: 480px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow:
    0 8px 30px
    rgba(0, 0, 0, 0.15);
}

h2 {
  margin-top: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
textarea,
select {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  font: inherit;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

button {
  padding: 9px 14px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error {
  margin: 5px 0 0;
  color: #b00020;
}
</style>