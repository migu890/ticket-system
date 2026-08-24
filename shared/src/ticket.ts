import { z } from 'zod'

export const ticketStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'CLOSED'
])

export const ticketPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH'
])

export const createTicketSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3),
  priority: ticketPrioritySchema
})

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3),
  priority: ticketPrioritySchema
})

export const updateTicketStatusSchema = z.object({
  status: ticketStatusSchema
})

export const assignTicketSchema = z.object({
  assignedToId: z.string().uuid().nullable()
})

export const ticketSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: ticketStatusSchema,
  priority: ticketPrioritySchema,
  createdById: z.string().uuid(),
  createdByName: z.string(),
  assignedToId: z.string().uuid().nullable(),
  assignedToName: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type TicketStatus = z.infer<typeof ticketStatusSchema>
export type TicketPriority = z.infer<typeof ticketPrioritySchema>

export type CreateTicketDTO = z.infer<typeof createTicketSchema>
export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>

export type UpdateTicketStatusDTO =
  z.infer<typeof updateTicketStatusSchema>

export type AssignTicketDTO =
  z.infer<typeof assignTicketSchema>

export type TicketDTO =
  z.infer<typeof ticketSchema>