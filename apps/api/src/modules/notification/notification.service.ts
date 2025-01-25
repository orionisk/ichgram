import { prisma } from '@api/utils/prisma'

export async function getNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      userId: true,
      fromId: true,
      postId: true,
      read: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      fromUser: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      post: {
        select: {
          imageUrl: true,
        },
      },
    },
    orderBy: [
      {
        read: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
    take: 20,
  })

  return {
    items: notifications.map(n => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      type: n.type as 'like' | 'comment' | 'follow',
      targetImage: n.post?.imageUrl,
    })),
  }
}

export async function getUnreadCount(userId: string) {
  const count = await prisma.notification.count({
    where: {
      userId,
      read: false,
    },
  })

  return { count }
}

export async function markAsRead(userId: string, ids: string[]) {
  await prisma.notification.updateMany({
    where: {
      id: { in: ids },
      userId,
    },
    data: {
      read: true,
    },
  })

  return { success: true }
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  })

  return { success: true }
}

export async function createNotification({
  type,
  userId,
  fromId,
  postId,
}: {
  type: 'like' | 'comment' | 'follow'
  userId: string
  fromId: string
  postId?: string
}) {
  if (userId === fromId) {
    return null
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type,
      userId,
      fromId,
      postId: postId || null,
    },
  })

  if (existingNotification) {
    return null
  }

  const notification = await prisma.notification.create({
    data: {
      type,
      userId,
      fromId,
      postId,
    },
  })

  return notification
}

export async function deleteNotifications(postId: string) {
  await prisma.notification.deleteMany({
    where: { postId },
  })

  return { success: true }
}
