import type { InferRequestType, InferResponseType } from '@ichgram/api-client'
import type { api } from './lib/api-client'

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow'
  userId: string
  username: string
  userAvatar: string
  targetId: string
  targetImage?: string
  createdAt: string
}

export type ModalType =
  | 'search'
  | 'notifications'
  | 'create'
  | 'post-info'
  | 'post-edit'
  | null

export interface PostComment2 {
  id: string
  user: {
    username: string
    avatarUrl: string
  }
  text: string
  timeAgo: Date
  likes: number
}

export type ChatRoom = InferResponseType<typeof api.chat.rooms['$get'], 200>[number]
export type ChatMessage = InferResponseType<typeof api.chat.history[':userId']['$get'], 200>['items'][number]
export type Post = InferResponseType<typeof api.posts.id[':id']['$get'], 200>
export type Posts = InferResponseType<typeof api.posts['$get'], 200>['items']
export type User = InferResponseType<typeof api.user[':username']['profile']['$get'], 200>
export type CurrentUser = InferResponseType<typeof api.user['me']['$get'], 200>
export type ProfileFormValues = InferRequestType<typeof api.user['me']['$patch']>['form']
export type PostComment = InferResponseType<typeof api.posts.comments[':postId']['$get'], 200>['items'][number]
export type PostComments = InferResponseType<typeof api.posts.comments[':postId']['$get'], 200>['items']
