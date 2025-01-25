import type { AppRouteHandler } from '@api/lib/types'
import type {
  GetCurrentUserRoute,
  GetUserProfileRoute,
  GetUsersRoute,
  UpdateProfileRoute,
} from './user.routes'
import * as storageService from '@api/core/storage/storage.service'
import * as R from 'stoker/http-status-codes'
import * as userService from './user.service'

export const getUsers: AppRouteHandler<GetUsersRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const name = c.req.query('name')
  const users = await userService.getUsers(name, userId)

  return c.json(users, R.OK)
}

export const getCurrentUser: AppRouteHandler<GetCurrentUserRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')

  const user = await userService.getCurrentUser(userId)
  return c.json(user, R.OK)
}

export const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
  const { id: currentUserId } = c.get('jwtPayload')
  const formData = c.req.valid('form')
  const logger = c.get('logger')

  const currentUser = await userService.getCurrentUser(currentUserId)
  let oldAvatarUrl: string | undefined
  let newAvatarUrl: string | undefined

  try {
    if (formData.avatar) {
      oldAvatarUrl = currentUser.avatarUrl || undefined
      newAvatarUrl = await storageService.uploadFile(formData.avatar)
    }

    const data = {
      ...(formData.username && { username: formData.username }),
      ...(formData.bio !== undefined && { bio: formData.bio }),
      ...(formData.website !== undefined && { website: formData.website }),
      ...(formData.avatar && { avatarUrl: newAvatarUrl }),
    }

    const user = await userService.updateProfile(currentUserId, data)

    if (oldAvatarUrl && newAvatarUrl) {
      await storageService.deleteFile(oldAvatarUrl).catch((error) => {
        logger.error('Failed to delete old avatar:', error)
      })
    }

    return c.json(user, R.OK)
  }
  catch (error) {
    if (newAvatarUrl) {
      await storageService.deleteFile(newAvatarUrl).catch((cleanupError) => {
        logger.error('Failed to clean up new avatar:', cleanupError)
      })
    }
    throw error
  }
}

export const getUserProfile: AppRouteHandler<GetUserProfileRoute> = async (c) => {
  const username = c.req.param('username')
  const { id: currentUserId } = c.get('jwtPayload')
  const profile = await userService.getUserProfile(username, currentUserId)
  return c.json(profile, R.OK)
}
