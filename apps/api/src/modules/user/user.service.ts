import { ConflictError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'

const userSelectFields = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  bio: true,
  website: true,
} as const

const counterSelectFields = {
  followers: true,
  following: true,
  posts: true,
} as const

function getCountSelect(includeCounters?: boolean) {
  return includeCounters
    ? {
        _count: {
          select: counterSelectFields,
        },
      }
    : undefined
}

export async function getCurrentUser(
  id: string,
) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelectFields,
      _count: {
        select: counterSelectFields,
      },
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user
}

export async function getUserProfile(username: string, currentUserId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...userSelectFields,
      _count: {
        select: counterSelectFields,
      },
      posts: {
        select: {
          id: true,
          imageUrl: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      followers: currentUserId
        ? {
            where: {
              followerId: currentUserId,
            },
            select: {
              followerId: true,
            },
          }
        : false,
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const { followers, ...rest } = user
  return {
    ...rest,
    isFollowing: currentUserId ? followers.length > 0 : false,
  }
}

export async function updateProfile(
  userId: string,
  data: {
    username?: string
    bio?: string
    website?: string
    avatarUrl?: string
  },
) {
  if (data.username) {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: data.username,
        NOT: {
          id: userId,
        },
      },
    })

    if (existingUser) {
      throw new ConflictError('Username already taken')
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
    select: {
      ...userSelectFields,
    },
  })

  if (!updatedUser) {
    throw new Error('Failed to update profile')
  }

  return updatedUser
}

export async function getUsers(name?: string, currentUserId?: string) {
  const where = {
    ...(name
      ? {
          OR: [
            { username: { contains: name, mode: 'insensitive' as const } },
            { fullName: { contains: name, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(currentUserId
      ? {
          NOT: {
            id: currentUserId,
          },
        }
      : {}),
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      ...userSelectFields,
      ...getCountSelect(true),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  return users
}
