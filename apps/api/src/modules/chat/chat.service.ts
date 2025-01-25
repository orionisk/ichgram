import { BadRequestError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'

export async function getChatRooms(userId: string) {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      participants: {
        some: {
          id: userId,
        },
      },
      messages: {
        some: {},
      },
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return rooms.map((room) => {
    const lastMessage = room.messages[0] || null
    return {
      ...room,
      lastMessage,
      messages: undefined,
    }
  })
}

export async function getChatHistory(userId: string, otherUserId: string, page = 1, limit = 20) {
  const whereClause = {
    OR: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }

  const total = await prisma.chatMessage.count({ where: whereClause })
  const skip = (page - 1) * limit

  const messages = await prisma.chatMessage.findMany({
    where: whereClause,
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
  })

  return {
    items: messages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  })

  if (!receiver)
    throw new NotFoundError('User')

  const room = await prisma.chatRoom.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              id: senderId,
            },
          },
        },
        {
          participants: {
            some: {
              id: receiverId,
            },
          },
        },
      ],
    },
  })

  if (!room)
    throw new NotFoundError('ChatRoom')

  const message = await prisma.chatMessage.create({
    data: {
      content,
      senderId,
      receiverId,
      chatRoomId: room.id,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  })

  await prisma.chatRoom.update({
    where: { id: room.id },
    data: { updatedAt: new Date() },
  })

  return message
}

export async function createChatRoom(userId: string, participantId: string) {
  if (userId === participantId)
    throw new BadRequestError('You cannot create a chat room with yourself')

  const participant = await prisma.user.findUnique({
    where: { id: participantId },
  })

  if (!participant)
    throw new NotFoundError('User')

  const existingRoom = await prisma.chatRoom.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              id: userId,
            },
          },
        },
        {
          participants: {
            some: {
              id: participantId,
            },
          },
        },
      ],
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      messages: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          content: true,
          senderId: true,
          receiverId: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  })

  if (existingRoom) {
    return {
      ...existingRoom,
      lastMessage: existingRoom.messages[0] ?? null,
    }
  }

  const room = await prisma.chatRoom.create({
    data: {
      participants: {
        connect: [
          { id: userId },
          { id: participantId },
        ],
      },
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  })

  return {
    ...room,
    lastMessage: null,
  }
}
