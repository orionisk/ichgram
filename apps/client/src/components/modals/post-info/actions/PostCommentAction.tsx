import { EmojiSelectorIcon } from '@/assets/icons/icons'
import { EmojiPicker } from '@/components/EmojiPicker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Textarea } from '@/components/ui/textarea'
import { useCreateComment } from '@/hooks/usePosts'
import { useRef, useState } from 'react'

export function PostCommentAction({ postId }: { postId: string }) {
  const [comment, setComment] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutateAsync: createComment } = useCreateComment()

  const onSubmit = () => {
    createComment({ postId, content: comment })
    setComment('')
  }

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current
    const cursorPosition = textarea?.selectionStart ?? comment.length

    const newComment
      = comment.slice(0, cursorPosition) + emoji + comment.slice(cursorPosition)

    setComment(newComment)
  }
  return (
    <div className="mt-1 flex h-[45px] items-center gap-2 border-t border-[#DBDBDB] py-1.5 lg:mt-3">
      <div className="relative flex w-full items-center gap-2 px-2">
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <EmojiSelectorIcon className="size-5 text-[#737373]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full border-none p-0"
            side="top"
            align="start"
            sideOffset={0}
          >
            <EmojiPicker handleEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>
        <Textarea
          placeholder="Add comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSubmit()
            }
          }}
          className="h-[30px] min-h-[20px] w-full flex-1 resize-none border-none bg-transparent p-0 pl-2 pt-[6px] text-xs placeholder:text-[#737373] focus-visible:ring-0 [&::-webkit-scrollbar]:hidden"
        />
        <button
          className="mr-9 text-xs font-semibold text-[#0095F6] disabled:opacity-50"
          onClick={onSubmit}
        >
          Send
        </button>
      </div>
    </div>
  )
}
