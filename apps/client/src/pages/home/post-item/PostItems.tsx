import type { Posts } from '@/types'
import type { LazyComponentProps } from 'react-lazy-load-image-component'
import { trackWindowScroll } from 'react-lazy-load-image-component'
import { PostItem } from './PostItem'

export const PostItems = trackWindowScroll(({ posts, scrollPosition }: { posts: Posts[number][] } & LazyComponentProps) => {
  return (
    <div className="mt-2 grid gap-5 xs:grid-cols-2 lg:gap-x-10 lg:gap-y-5">
      {posts.map(post => (
        <PostItem key={post.id} post={post} scrollPosition={scrollPosition} />
      ))}
    </div>
  )
})
