import type {
  AssignTicketDTO,
  CreateTicketDTO,
  TicketDTO,
  TicketStatus,
  UpdateTicketDTO
} from '@ticket-system/shared'

import { apiRequest } from './apiClient'

export const getTickets = () => {
  return apiRequest<TicketDTO[]>(
    '/tickets'
  )
}

export const getTicket = (
  id: string
) => {
  return apiRequest<TicketDTO>(
    `/tickets/${id}`
  )
}

export const createTicket = (
  data: CreateTicketDTO
) => {
  return apiRequest<TicketDTO>(
    '/tickets',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}

export const updateTicket = (
  id: string,
  data: UpdateTicketDTO
) => {
  return apiRequest<TicketDTO>(
    `/tickets/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data)
    }
  )
}

export const deleteTicket = (
  id: string
) => {
  return apiRequest<void>(
    `/tickets/${id}`,
    {
      method: 'DELETE'
    }
  )
}

export const closeTicket = (
  id: string
) => {
  return apiRequest<TicketDTO>(
    `/tickets/${id}/close`,
    {
      method: 'PATCH'
    }
  )
}

export const changeTicketStatus = (
  id: string,
  status: TicketStatus
) => {
  return apiRequest<TicketDTO>(
    `/tickets/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    }
  )
}

export const assignTicket = (
  id: string,
  data: AssignTicketDTO
) => {
  return apiRequest<TicketDTO>(
    `/tickets/${id}/assign`,
    {
      method: 'PATCH',
      body: JSON.stringify(data)
    }
  )
}