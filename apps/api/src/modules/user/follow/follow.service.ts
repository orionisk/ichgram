import { ConflictError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'
import { Prisma } from '@prisma/client'

export async function createFollow(followerId: string, username: string) {
  const targetUser = await prisma.user.findUnique({
    where: { username },
  })

  if (!targetUser) {
    throw new NotFoundError('User not found')
  }

  if (targetUser.id === followerId) {
    throw new ConflictError('Cannot follow yourself')
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type: 'follow',
      userId: targetUser.id,
      fromId: followerId,
    },
  })

  try {
    await prisma.$transaction(async (tx) => {
      await tx.follows.create({
        data: {
          followerId,
          followingId: targetUser.id,
        },
      })

      if (!existingNotification) {
        await tx.notification.create({
          data: {
            type: 'follow',
            userId: targetUser.id,
            fromId: followerId,
          },
        })
      }
    })

    return { success: true }
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictError('Already following')
      }
    }
    throw error
  }
}

export async function removeFollow(followerId: string, username: string) {
  const targetUser = await prisma.user.findUnique({
    where: { username },
  })

  if (!targetUser) {
    throw new NotFoundError('User not found')
  }

  try {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
    })

    return { success: true }
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Not following')
      }
    }
    throw error
  }
}
