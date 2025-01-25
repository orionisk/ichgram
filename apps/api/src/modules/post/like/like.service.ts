import { ConflictError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'
import { Prisma } from '@prisma/client'

export async function createLike(postId: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new NotFoundError('Post not found')
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (existingLike) {
    throw new ConflictError('Already liked this post')
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type: 'like',
      userId: post.authorId,
      fromId: userId,
      postId,
    },
  })

  try {
    await prisma.$transaction(async (tx) => {
      await tx.like.create({
        data: {
          postId,
          userId,
        },
      })

      if (post.authorId !== userId && !existingNotification) {
        await tx.notification.create({
          data: {
            type: 'like',
            userId: post.authorId,
            fromId: userId,
            postId,
          },
        })
      }
    })

    return { success: true }
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictError('Already liked this post')
      }
    }
    throw error
  }
}

export async function deleteLike(postId: string, userId: string) {
  try {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    return { success: true }
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Like not found')
      }
    }
    throw error
  }
}
