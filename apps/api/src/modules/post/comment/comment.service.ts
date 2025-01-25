import { AuthorizationError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'

interface CreateCommentData {
  content: string
  postId: string
  userId: string
}

export async function createComment(data: CreateCommentData) {
  const { content, postId, userId } = data

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new NotFoundError('Post not found')
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type: 'comment',
      userId: post.authorId,
      fromId: userId,
      postId,
    },
  })

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId,
    },
    select: {
      id: true,
      content: true,
      postId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          id: true,
        },
      },
    },
  })

  if (post.authorId !== userId && !existingNotification) {
    await prisma.notification.create({
      data: {
        type: 'comment',
        userId: post.authorId,
        fromId: userId,
        postId,
      },
    })
  }

  return {
    ...comment,
    author: comment.user,
    hasLiked: comment.likes.length > 0,
  }
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  })

  if (!comment) {
    throw new NotFoundError('Comment not found')
  }

  if (comment.userId !== userId) {
    throw new AuthorizationError()
  }

  await prisma.comment.delete({
    where: { id: commentId },
  })

  return { success: true }
}

export async function getPostComments(postId: string, userId?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new NotFoundError('Post')
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: userId
          ? {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.comment.count({
      where: { postId },
    }),
  ])

  return {
    items: comments.map(comment => ({
      ...comment,
      hasLiked: comment.likes ? comment.likes.length > 0 : false,
      likes: undefined,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
