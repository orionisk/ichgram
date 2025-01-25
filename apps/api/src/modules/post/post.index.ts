import { createRouter } from '@api/lib/create-router'
import comment from './comment/comment.index'
import like from './like/like.index'
import * as handlers from './post.handlers'
import * as routes from './post.routes'

const router = createRouter()
  .openapi(routes.getPosts, handlers.getPosts)
  .openapi(routes.getExplorePosts, handlers.getExplorePosts)
  .openapi(routes.getPost, handlers.getPost)
  .openapi(routes.getUserPosts, handlers.getUserPosts)
  .openapi(routes.createPost, handlers.createPost)
  .openapi(routes.updatePost, handlers.updatePost)
  .openapi(routes.deletePost, handlers.deletePost)
  .route('/like', like)
  .route('/comments', comment)
export default router
