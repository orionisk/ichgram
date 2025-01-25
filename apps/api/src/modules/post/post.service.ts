import { deleteFile } from '@api/core/storage/storage.service'
import { AuthorizationError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'

interface CreatePostData {
  content: string
  imageUrl: string
}

export async function createPost(userId: string, data: CreatePostData) {
  const { content, imageUrl } = data

  return prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  })
}

type UpdatePostData = Partial<CreatePostData>

export async function updatePost(userId: string, postId: string, data: UpdatePostData) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new NotFoundError('Post not found')
  }

  if (post.authorId !== userId) {
    throw new AuthorizationError('Not authorized to update this post')
  }

  return prisma.post.update({
    where: { id: postId },
    data: { ...data },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  })
}

export async function getPost(postId: string, userId?: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
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
              userId: true,
            },
          }
        : false,
    },
  })

  if (!post) {
    throw new NotFoundError('Post not found')
  }

  return {
    ...post,
    isLiked: userId ? post.likes.length > 0 : false,
    likes: undefined,
  }
}

export async function getPosts(userId?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            followers: userId
              ? {
                  where: {
                    followerId: userId,
                  },
                  select: {
                    followerId: true,
                  },
                }
              : false,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: userId
          ? {
              where: {
                userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
    }),
    prisma.post.count(),
  ])

  return {
    items: posts.map((post) => {
      const { followers, ...authorRest } = post.author
      return {
        ...post,
        isLiked: userId ? post.likes.length > 0 : false,
        author: {
          ...authorRest,
          isFollowing: userId ? followers?.length > 0 : false,
        },
      }
    }),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getUserProfilePosts(username: string, page = 1, limit = 12) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user)
    throw new NotFoundError('User not found')

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        imageUrl: true,
      },
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({
      where: {
        authorId: user.id,
      },
    }),
  ])

  return {
    items: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getExplorePosts(userId: string) {
  const userLikedPosts = await prisma.like.findMany({
    where: { userId },
    select: { postId: true },
  })

  const likedPostIds = userLikedPosts.map(like => like.postId)

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      imageUrl: true,
    },
    where: {
      AND: [{ authorId: { notIn: [userId] } }, { id: { notIn: likedPostIds } }],
    },
    orderBy: [
      {
        likes: {
          _count: 'desc',
        },
      },
      {
        comments: {
          _count: 'desc',
        },
      },
    ],
    take: 10,
  })

  return posts
}

export async function deletePost(userId: string, postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new NotFoundError('Post not found')
  }

  if (post.authorId !== userId) {
    throw new AuthorizationError('Not authorized to delete this post')
  }

  await prisma.$transaction([
    prisma.commentLike.deleteMany({
      where: {
        comment: {
          postId,
        },
      },
    }),
    prisma.like.deleteMany({
      where: { postId },
    }),
    prisma.comment.deleteMany({
      where: { postId },
    }),
    prisma.notification.deleteMany({
      where: { postId },
    }),
    prisma.post.delete({
      where: { id: postId },
    }),
  ])

  await deleteFile(post.imageUrl)

  return { success: true }
}
