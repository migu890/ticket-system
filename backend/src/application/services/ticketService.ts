import { prisma } from '../../infrastructure/prisma/prismaClient.js'
import { AppError } from '../errors/AppError.js'

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export const getTickets = async () => {
  const tickets = await prisma.ticket.findMany({
    include: {
      createdBy: true,
      assignedTo: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return tickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdById: ticket.createdById,
    createdByName: ticket.createdBy.name,
    assignedToId: ticket.assignedToId,
    assignedToName:
      ticket.assignedTo?.name ?? null,
    createdAt:
      ticket.createdAt.toISOString(),
    updatedAt:
      ticket.updatedAt.toISOString()
  }))
}

export const getTicketById = async (
  id: string
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id
      },
      include: {
        createdBy: true,
        assignedTo: true
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdById: ticket.createdById,
    createdByName: ticket.createdBy.name,
    assignedToId: ticket.assignedToId,
    assignedToName:
      ticket.assignedTo?.name ?? null,
    createdAt:
      ticket.createdAt.toISOString(),
    updatedAt:
      ticket.updatedAt.toISOString()
  }
}

export const createTicket = async (
  userId: string,
  input: {
    title: string
    description: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  }
) => {
  return prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      createdById: userId
    }
  })
}

export const updateTicket = async (
  id: string,
  user: AuthenticatedUser,
  input: {
    title: string
    description: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  }
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  if (
    user.role !== 'ADMIN' &&
    ticket.createdById !== user.id
  ) {
    throw new AppError(
      403,
      'Du darfst dieses Ticket nicht bearbeiten'
    )
  }

  return prisma.ticket.update({
    where: {
      id
    },
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority
    }
  })
}

export const deleteTicket = async (
  id: string,
  user: AuthenticatedUser
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  if (
    user.role !== 'ADMIN' &&
    ticket.createdById !== user.id
  ) {
    throw new AppError(
      403,
      'Du darfst dieses Ticket nicht löschen'
    )
  }

  await prisma.ticket.delete({
    where: {
      id
    }
  })
}

export const updateTicketStatus = async (
  id: string,
  status:
    | 'OPEN'
    | 'IN_PROGRESS'
    | 'CLOSED'
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  return prisma.ticket.update({
    where: {
      id
    },
    data: {
      status
    }
  })
}

export const closeOwnTicket = async (
  id: string,
  userId: string
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  if (
    ticket.createdById !== userId
  ) {
    throw new AppError(
      403,
      'Du darfst dieses Ticket nicht schliessen'
    )
  }

  return prisma.ticket.update({
    where: {
      id
    },
    data: {
      status: 'CLOSED'
    }
  })
}

export const assignTicket = async (
  ticketId: string,
  userId: string | null
) => {
  const ticket =
    await prisma.ticket.findUnique({
      where: {
        id: ticketId
      }
    })

  if (!ticket) {
    throw new AppError(
      404,
      'Ticket nicht gefunden'
    )
  }

  if (userId !== null) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId
        }
      })

    if (!user) {
      throw new AppError(
        404,
        'Benutzer nicht gefunden'
      )
    }
  }

  return prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      assignedToId: userId
    }
  })
}