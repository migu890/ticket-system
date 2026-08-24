import { Hono } from 'hono'
import type { AppBindings } from '../../types/app.js'
import { AppError } from '../../application/errors/AppError.js'

import {
  assignTicketSchema,
  createTicketSchema,
  updateTicketSchema,
  updateTicketStatusSchema
} from '@ticket-system/shared'

import {
  authMiddleware
} from '../middleware/authMiddleware.js'

import {
  adminMiddleware
} from '../middleware/adminMiddleware.js'

import {
  assignTicket,
  closeOwnTicket,
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
  updateTicketStatus
} from '../../application/services/ticketService.js'

export const ticketRoutes =
  new Hono<AppBindings>()

ticketRoutes.use(
  '*',
  authMiddleware
)

ticketRoutes.get(
  '/',
  async (c) => {
    const tickets =
      await getTickets()

    return c.json(tickets)
  }
)

ticketRoutes.get(
  '/:id',
  async (c) => {
    try {
      const id =
        c.req.param('id')

      const ticket =
        await getTicketById(id)

      return c.json(ticket)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Fehler'

      return c.json(
        {
          message
        },
        404
      )
    }
  }
)

ticketRoutes.post(
  '/',
  async (c) => {
    const user =
      c.get('user')

    const body =
      await c.req.json()

    const result =
      createTicketSchema.safeParse(
        body
      )

    if (!result.success) {
      return c.json(
        {
          message:
            'Ungültige Ticketdaten'
        },
        400
      )
    }

    const ticket =
      await createTicket(
        user.id,
        result.data
      )

    return c.json(
      ticket,
      201
    )
  }
)

ticketRoutes.put(
  '/:id',
  async (c) => {
    const user =
      c.get('user')

    const body =
      await c.req.json()

    const result =
      updateTicketSchema.safeParse(
        body
      )

    if (!result.success) {
      return c.json(
        {
          message:
            'Ungültige Ticketdaten'
        },
        400
      )
    }

    try {
      const id =
        c.req.param('id')

      const ticket =
        await updateTicket(
          id,
          user,
          result.data
        )

      return c.json(ticket)
    } catch (error) {
if (error instanceof AppError) {
  return c.json(
    {
      message: error.message
    },
    error.statusCode
  )
}

return c.json(
  {
    message: 'Interner Serverfehler'
  },
  500
)
    }
  }
)

ticketRoutes.delete(
  '/:id',
  async (c) => {
    const user =
      c.get('user')

    try {
      const id =
        c.req.param('id')

      await deleteTicket(
        id,
        user
      )

      return c.body(
        null,
        204
      )
    } catch (error) {
    if (error instanceof AppError) {
  return c.json(
    {
      message: error.message
    },
    error.statusCode
  )
}

return c.json(
  {
    message: 'Interner Serverfehler'
  },
  500
)}
  }
)

ticketRoutes.patch(
  '/:id/close',
  async (c) => {
    const user =
      c.get('user')

    try {
      const id =
        c.req.param('id')

      const ticket =
        await closeOwnTicket(
          id,
          user.id
        )

      return c.json(ticket)
    } catch (error) {
      if (error instanceof AppError) {
  return c.json(
    {
      message: error.message
    },
    error.statusCode
  )
}

return c.json(
  {
    message: 'Interner Serverfehler'
  },
  500
)
    }
  }
)

ticketRoutes.patch(
  '/:id/status',
  adminMiddleware,
  async (c) => {
    const body =
      await c.req.json()

    const result =
      updateTicketStatusSchema.safeParse(
        body
      )

    if (!result.success) {
      return c.json(
        {
          message:
            'Ungültiger Status'
        },
        400
      )
    }

    try {
const id = c.req.param('id')

if (!id) {
  return c.json(
    {
      message: 'Ticket-ID fehlt'
    },
    400
  )
}

const ticket = await updateTicketStatus(
  id,
  result.data.status
)
      return c.json(ticket)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Interner Serverfehler'

      return c.json(
        {
          message
        },
        500
      )
    }
  }
)

ticketRoutes.patch(
  '/:id/assign',
  adminMiddleware,
  async (c) => {
    const body =
      await c.req.json()

    const result =
      assignTicketSchema.safeParse(
        body
      )

    if (!result.success) {
      return c.json(
        {
          message:
            'Ungültige Benutzer-ID'
        },
        400
      )
    }

    try {
const id = c.req.param('id')

if (!id) {
  return c.json(
    {
      message: 'Ticket-ID fehlt'
    },
    400
  )
}

const ticket = await assignTicket(
  id,
  result.data.assignedToId
)

      return c.json(ticket)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Interner Serverfehler'

      return c.json(
        {
          message
        },
        500
      )
    }
  }
)