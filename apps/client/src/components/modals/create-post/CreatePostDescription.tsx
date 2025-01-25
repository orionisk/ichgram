import type { CurrentUser } from '@/types'
import { EmojiSelectorIcon } from '@/assets/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Textarea } from '@/components/ui/textarea'
import { useRef } from 'react'
import { EmojiPicker } from '../../EmojiPicker'

interface PostDescriptionProps {
  caption: string
  onCaptionChange: (caption: string) => void
  currentUser?: CurrentUser
}

export function CreatePostDescription({
  caption,
  onCaptionChange,
  currentUser,
}: PostDescriptionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current
    const cursorPosition = textarea?.selectionStart ?? caption.length

    const newCaption
      = caption.slice(0, cursorPosition) + emoji + caption.slice(cursorPosition)

    onCaptionChange(newCaption)
  }

  const getGraphemeLength = (str: string) => {
    return [...new Intl.Segmenter().segment(str)].length
  }

  return (
    <div className=" border-[#DBDBDB]">
      <div className="flex items-center gap-3 p-4">
        <Avatar className="size-7 border border-[#000]/10 bg-[#fafafa]">
          <AvatarImage src="/avatar-profile.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{currentUser?.username}</span>
      </div>
      <div className="relative px-4">
        <div className="grid">
          <Textarea
            ref={textareaRef}
            placeholder="Write a caption..."
            value={caption}
            onChange={e => onCaptionChange(e.target.value)}
            className="min-h-20 resize-none border-none p-0 text-sm placeholder:text-[#737373] focus-visible:ring-0 sm:min-h-[120px]"
          />
          <span className="mt-2 justify-self-end text-xs text-[#C7C7C7]">
            {getGraphemeLength(caption)}
            /200
          </span>
        </div>
        <div className="mt-9 flex w-full items-center justify-between border-b border-[#DBDBDB] py-3">
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
              sideOffset={-180}
            >
              <EmojiPicker handleEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
