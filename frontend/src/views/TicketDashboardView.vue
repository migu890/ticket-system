<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue'

import { useRouter } from 'vue-router'

import type {
  TicketDTO,
  TicketStatus,
  UserDTO
} from '@ticket-system/shared'

import {
  assignTicket,
  changeTicketStatus,
  closeTicket,
  deleteTicket,
  getTickets
} from '../api/ticketApi'

import {
  getUsers
} from '../api/userApi'

import {
  useAuth
} from '../composables/useAuth'

import TicketForm from '../components/TicketForm.vue'

const router = useRouter()

const {
  user,
  isAdmin,
  logout
} = useAuth()

const tickets = ref<TicketDTO[]>([])

const users = ref<UserDTO[]>([])

const showForm = ref(false)

const selectedTicket = ref<TicketDTO | null>(null)

const error = ref('')
const loading = ref(false)

const loadTickets = async () => {
  loading.value = true
  error.value = ''

  try {
    tickets.value = await getTickets()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Tickets konnten nicht geladen werden'
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  if (!isAdmin.value) {
    return
  }

  try {
    users.value = await getUsers()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Benutzer konnten nicht geladen werden'
  }
}

const openCreate = () => {
  selectedTicket.value = null
  showForm.value = true
}

const openEdit = (
  ticket: TicketDTO
) => {
  selectedTicket.value = ticket
  showForm.value = true
}

const closeForm = () => {
  selectedTicket.value = null
  showForm.value = false
}

const ticketSaved = async () => {
  closeForm()
  await loadTickets()
}

const removeTicket = async (
  id: string
) => {
  const confirmed = window.confirm(
    'Soll dieses Ticket wirklich gelöscht werden?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteTicket(id)
    await loadTickets()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Ticket konnte nicht gelöscht werden'
  }
}

const close = async (
  id: string
) => {
  try {
    await closeTicket(id)
    await loadTickets()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Ticket konnte nicht geschlossen werden'
  }
}

const isTicketStatus = (
  value: string
): value is TicketStatus => {
  return (
    value === 'OPEN' ||
    value === 'IN_PROGRESS' ||
    value === 'CLOSED'
  )
}

const changeStatus = async (
  id: string,
  event: Event
) => {
  if (!(event.target instanceof HTMLSelectElement)) {
    return
  }

  const status = event.target.value

  if (!isTicketStatus(status)) {
    return
  }

  try {
    await changeTicketStatus(
      id,
      status
    )

    await loadTickets()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Status konnte nicht geändert werden'

    await loadTickets()
  }
}

const assign = async (
  id: string,
  event: Event
) => {
  if (!(event.target instanceof HTMLSelectElement)) {
    return
  }

  const assignedToId =
    event.target.value || null

  try {
    await assignTicket(
      id,
      {
        assignedToId
      }
    )

    await loadTickets()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Ticket konnte nicht zugewiesen werden'

    await loadTickets()
  }
}

const canEdit = (
  ticket: TicketDTO
) => {
  return (
    isAdmin.value ||
    ticket.createdById === user.value?.id
  )
}

const canClose = (
  ticket: TicketDTO
) => {
  return (
    ticket.createdById === user.value?.id &&
    ticket.status !== 'CLOSED'
  )
}

const handleLogout = async () => {
  await logout()
  await router.push('/login')
}

onMounted(
  async () => {
    await loadTickets()
    await loadUsers()
  }
)
</script>

<template>
  <main class="page">
    <header>
      <div>
        <h1>Tickets</h1>

        <p>
          Support-Tickets erstellen
          und verwalten.
        </p>
      </div>

      <div class="user">
        <span v-if="user">
          {{ user.name }}
          –
          {{ user.role }}
        </span>

        <button
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </header>

    <section class="actions">
      <button @click="openCreate">
        Ticket erstellen
      </button>
    </section>

    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>

    <p v-if="loading">
      Tickets werden geladen...
    </p>

    <p
      v-else-if="
        tickets.length === 0
      "
    >
      Keine Tickets vorhanden.
    </p>

    <div
      v-else
      class="table-wrapper"
    >
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Status</th>
            <th>Priorität</th>
            <th>Erstellt von</th>
            <th>Zugewiesen an</th>
            <th>Erstellt</th>
            <th>Aktionen</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="ticket in tickets"
            :key="ticket.id"
          >
            <td>
              {{ ticket.title }}
            </td>

            <td>
              <select
                v-if="isAdmin"
                :value="ticket.status"
                @change="
                  changeStatus(
                    ticket.id,
                    $event
                  )
                "
              >
                <option value="OPEN">
                  Offen
                </option>

                <option value="IN_PROGRESS">
                  In Bearbeitung
                </option>

                <option value="CLOSED">
                  Geschlossen
                </option>
              </select>

              <span v-else>
                {{ ticket.status }}
              </span>
            </td>

            <td>
              {{ ticket.priority }}
            </td>

            <td>
              {{ ticket.createdByName }}
            </td>

            <td>
              <select
                v-if="isAdmin"
                :value="
                  ticket.assignedToId
                  ?? ''
                "
                @change="
                  assign(
                    ticket.id,
                    $event
                  )
                "
              >
                <option value="">
                  Nicht zugewiesen
                </option>

                <option
                  v-for="
                    availableUser
                    in users
                  "
                  :key="
                    availableUser.id
                  "
                  :value="
                    availableUser.id
                  "
                >
                  {{
                    availableUser.name
                  }}
                </option>
              </select>

              <span v-else>
                {{
                  ticket.assignedToName
                  ?? 'Nicht zugewiesen'
                }}
              </span>
            </td>

            <td>
              {{
                new Date(
                  ticket.createdAt
                ).toLocaleDateString(
                  'de-CH'
                )
              }}
            </td>

            <td class="ticket-actions">
              <button
                v-if="
                  canEdit(ticket)
                "
                @click="
                  openEdit(ticket)
                "
              >
                Bearbeiten
              </button>

              <button
                v-if="
                  canClose(ticket)
                "
                @click="
                  close(ticket.id)
                "
              >
                Schliessen
              </button>

              <button
                v-if="
                  canEdit(ticket)
                "
                @click="
                  removeTicket(
                    ticket.id
                  )
                "
              >
                Löschen
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TicketForm
      v-if="showForm"
      :ticket="selectedTicket"
      @saved="ticketSaved"
      @cancel="closeForm"
    />
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px;
  background: #f1f5f9;
  color: #0f172a;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  padding: 24px 28px;
  background: #0f172a;
  color: white;
  border-radius: 14px;
  box-shadow:
    0 8px 24px
    rgba(15, 23, 42, 0.16);
}

header h1 {
  margin: 0 0 6px;
  font-size: 2rem;
}

header p {
  margin: 0;
  color: #cbd5e1;
}

.user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user span {
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 14px;
  box-shadow:
    0 6px 20px
    rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th {
  padding: 14px 16px;
  background: #e2e8f0;
  color: #334155;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: left;
}

td {
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

tbody tr:hover {
  background: #f8fafc;
}

button {
  padding: 8px 13px;
  border: none;
  border-radius: 7px;
  background: #2563eb;
  color: white;
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

header button {
  background: #475569;
}

header button:hover {
  background: #334155;
}

.ticket-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ticket-actions button:nth-child(2) {
  background: #f59e0b;
  color: #1f2937;
}

.ticket-actions button:nth-child(2):hover {
  background: #d97706;
  color: white;
}

.ticket-actions button:last-child {
  background: #dc2626;
}

.ticket-actions button:last-child:hover {
  background: #b91c1c;
}

select {
  min-width: 135px;
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  background: #f8fafc;
  color: #0f172a;
}

select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.12);
}

.error {
  margin-bottom: 16px;
  padding: 12px 14px;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

@media (max-width: 700px) {
  .page {
    padding: 16px;
  }

  header {
    align-items: flex-start;
    flex-direction: column;
  }

  .user {
    width: 100%;
    justify-content: space-between;
  }
}
</style>