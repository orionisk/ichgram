import { useEffect, useRef } from 'react'

import 'emoji-picker-element'

export function EmojiPicker({
  handleEmojiClick,
}: {
  handleEmojiClick: (emoji: string) => void
}) {
  const ref = useRef(null)
  useEffect(() => {
    const picker = ref.current

    if (picker) {
      // @ts-expect-error error
      picker.addEventListener('emoji-click', e =>
        handleEmojiClick(e.detail.emoji.unicode))
    }

    return () => {
      if (picker) {
        // @ts-expect-error error
        picker.removeEventListener('emoji-click', e =>
          handleEmojiClick(e.detail.emoji.unicode))
      }
    }
  }, [handleEmojiClick])
  return (
    // @ts-expect-error error
    <emoji-picker
      ref={ref}
      style={
        {
          '--num-columns': '6',
          '--emoji-size': '1.5rem',
          '--emoji-padding': '0.4rem',
          'border': 'none',
          '--category-emoji-size': '1.125rem',
        } as React.CSSProperties
      }
    />
  )
}
