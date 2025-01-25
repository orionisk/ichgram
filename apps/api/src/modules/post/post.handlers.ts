import type { AppRouteHandler } from '@api/lib/types'
import type {
  CreatePostRoute,
  DeletePostRoute,
  GetExplorePostsRoute,
  GetPostRoute,
  GetPostsRoute,
  GetUserPostsRoute,
  UpdatePostRoute,
} from './post.routes'
import { deleteFile, uploadFile } from '@api/core/storage/storage.service'
import * as R from 'stoker/http-status-codes'
import * as postService from './post.service'

export const createPost: AppRouteHandler<CreatePostRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const formData = c.req.valid('form')

  let imageUrl = null

  try {
    imageUrl = await uploadFile(formData.image)
    const data = { content: formData.content || '', imageUrl }
    const result = await postService.createPost(userId, data)

    return c.json(result, R.OK)
  }
  catch (error) {
    if (imageUrl) {
      await deleteFile(imageUrl)
    }
    throw error
  }
}

export const updatePost: AppRouteHandler<UpdatePostRoute> = async (c) => {
  const logger = c.get('logger')
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('id')
  const formData = c.req.valid('form')

  const post = await postService.getPost(postId)
  let oldImageUrl: string | undefined
  let newImageUrl: string | undefined

  try {
    if (formData.image) {
      oldImageUrl = post.imageUrl
      newImageUrl = await uploadFile(formData.image)
    }

    const data = {
      ...(formData.content && { content: formData.content }),
      ...(newImageUrl && { imageUrl: newImageUrl }),
    }

    const result = await postService.updatePost(userId, postId, data)

    if (oldImageUrl && newImageUrl) {
      await deleteFile(oldImageUrl).catch((error) => {
        logger.error('Failed to delete old image:', error)
      })
    }

    return c.json(result, R.OK)
  }
  catch (error) {
    if (newImageUrl) {
      await deleteFile(newImageUrl).catch((cleanupError) => {
        logger.error('Failed to clean up new image:', cleanupError)
      })
    }
    throw error
  }
}

export const getPosts: AppRouteHandler<GetPostsRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const { page, limit } = c.req.valid('query')

  const posts = await postService.getPosts(userId, page, limit)
  return c.json(posts, R.OK)
}

export const getUserPosts: AppRouteHandler<GetUserPostsRoute> = async (c) => {
  const username = c.req.param('username')
  const { page, limit } = c.req.valid('query')
  const posts = await postService.getUserProfilePosts(username, page, limit)
  return c.json(posts, R.OK)
}

export const getPost: AppRouteHandler<GetPostRoute> = async (c) => {
  const postId = c.req.param('id')
  const { id: userId } = c.get('jwtPayload')
  const post = await postService.getPost(postId, userId)
  return c.json(post, R.OK)
}

export const getExplorePosts: AppRouteHandler<GetExplorePostsRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const posts = await postService.getExplorePosts(userId)
  return c.json(posts, R.OK)
}

export const deletePost: AppRouteHandler<DeletePostRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('id')

  await postService.deletePost(userId, postId)
  return c.json({ success: true }, R.OK)
}
