import { ConflictError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'
import { Prisma } from '@prisma/client'

export async function createCommentLike(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      userId: true,
      postId: true,
    },
  })

  if (!comment) {
    throw new NotFoundError('Comment')
  }

  // if (comment.userId === userId) {
  //   throw new ConflictError('Cannot like your own comment')
  // }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  })

  if (existingLike) {
    throw new ConflictError('Already liked this comment')
  }

  try {
    await prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    })

    return { success: true }
  }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Already liked this comment')
      }
    }
    throw error
  }
}

export async function deleteCommentLike(commentId: string, userId: string) {
  try {
    await prisma.commentLike.delete({
      where: {
        commentId_userId: {
          commentId,
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
