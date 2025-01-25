import { useQueryState } from 'nuqs'

interface PostItemInfoProps {
  likes: number
  comments: number
  author: {
    username: string
    fullName: string
  }
  content: string | null
  postId: string
}

export function PostItemInfo({ likes, comments, author, content, postId }: PostItemInfoProps) {
  const [, setPostId] = useQueryState('postId')

  const getGraphemeLength = (str: string) => {
    return [...new Intl.Segmenter().segment(str)].length
  }

  const handleMoreClick = () => {
    setPostId(postId)
  }

  return (
    <div className="pt-2">
      <div className="text-xs font-semibold">
        {likes.toLocaleString()}
        {' '}
        likes
      </div>
      {content && (
        <>
          <div className="mt-2 text-xs">
            <span className="font-semibold">{author.fullName}</span>
            {' '}
            <div className="inline-block break-all text-[12px]">
              {getGraphemeLength(content) > 50
                ? (
                    <>
                      {`${content.slice(0, 50)}...`}
                      <button
                        className="text-[#737373]"
                        onClick={handleMoreClick}
                      >
                        <span className="ml-1">more</span>
                      </button>
                    </>
                  )
                : content}
            </div>
          </div>
        </>
      )}

      {comments > 0 && (
        <button
          className="mt-2 text-xs text-[#737373]"
          onClick={handleMoreClick}
        >
          View all comments (
          {comments}
          )
        </button>
      )}
    </div>
  )
}
