import { forbiddenSchema, notFoundSchema, unauthorizedSchema } from '@api/lib/constants'
import { mongoIdSchema, paginationQuerySchema } from '@api/schemas/common'
import { createRoute, z } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as S from './post.schema'

const tags = ['Posts']

export const getPost = createRoute({
  method: 'get',
  path: '/id/:id',
  security: [{ bearerAuth: [] }],
  tags: ['Posts'],
  description: 'Get a post by id',
  summary: 'Get a post by id',
  request: {
    params: mongoIdSchema,
  },
  responses: {
    [R.OK]: json(S.getPostResSchema, 'Post details'),
    [R.NOT_FOUND]: json(notFoundSchema, 'Post not found'),
  },
})

export const createPost = createRoute({
  method: 'post',
  path: '/',
  security: [{ bearerAuth: [] }],
  description: 'Create a new post',
  summary: 'Create a new post',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: S.createPostReqSchema,
        },
      },
    },
  },
  tags,
  responses: {
    [R.OK]: json(S.getPostResSchema, 'Created post'),
    [R.NOT_FOUND]: json(notFoundSchema, 'Post not found'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
    [R.UNPROCESSABLE_ENTITY]: json(error(S.createPostReqSchema), 'Unprocessable entity'),
  },
})

export const updatePost = createRoute({
  method: 'patch',
  path: '/id/:id',
  security: [{ bearerAuth: [] }],
  description: 'Update a post',
  summary: 'Update a post',
  request: {
    params: mongoIdSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: S.updatePostReqSchema,
        },
      },
    },
  },
  tags,
  responses: {
    [R.OK]: json(S.getPostResSchema, 'Updated post'),
    [R.NOT_FOUND]: json(notFoundSchema, 'Post not found'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
    [R.UNPROCESSABLE_ENTITY]: json(error(S.updatePostReqSchema), 'Unprocessable entity'),
    [R.FORBIDDEN]: json(forbiddenSchema, 'Not authorized to update this post'),
  },
})

export const deletePost = createRoute({
  method: 'delete',
  path: '/id/:id',
  security: [{ bearerAuth: [] }],
  description: 'Delete a post',
  summary: 'Delete a post',
  request: {
    params: mongoIdSchema,
  },
  tags,
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'Deleted post'),
    [R.NOT_FOUND]: json(notFoundSchema, 'Post not found'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
    [R.FORBIDDEN]: json(forbiddenSchema, 'Not authorized to delete this post'),
  },
})

export const getPosts = createRoute({
  method: 'get',
  path: '/',
  security: [{ bearerAuth: [] }],
  request: {
    query: paginationQuerySchema,
  },
  tags,
  description: 'Get all posts',
  summary: 'Get all posts',
  responses: {
    [R.OK]: json(S.getPostsResSchema, 'List of posts'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
  },
})

export const getExplorePosts = createRoute({
  method: 'get',
  path: '/explore',
  security: [{ bearerAuth: [] }],
  tags,
  description: 'Get explore posts',
  summary: 'Get explore posts',
  responses: {
    [R.OK]: json(S.getExplorePostsResSchema, 'List of explore posts'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
  },
})

export const getUserPosts = createRoute({
  method: 'get',
  path: '/user/:username',
  security: [{ bearerAuth: [] }],
  request: {
    query: paginationQuerySchema,
  },
  tags,
  description: 'Get a user posts',
  summary: 'Get a user posts',
  responses: {
    [R.OK]: json(S.getUserPostsResSchema, 'List of posts'),
    [R.NOT_FOUND]: json(notFoundSchema, 'User not found'),
    [R.UNAUTHORIZED]: json(unauthorizedSchema, 'Unauthorized'),
  },
})

export type CreatePostRoute = typeof createPost
export type UpdatePostRoute = typeof updatePost
export type GetPostsRoute = typeof getPosts
export type GetExplorePostsRoute = typeof getExplorePosts
export type GetUserPostsRoute = typeof getUserPosts
export type GetPostRoute = typeof getPost
export type DeletePostRoute = typeof deletePost
