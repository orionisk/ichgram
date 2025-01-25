import type { LazyComponentProps, LazyLoadImageProps } from 'react-lazy-load-image-component'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

type Props = {
  src?: string
  wrapperClassName?: string
  className?: string
  loaderClassName?: string
  imageClassName?: string
  alt?: string
} & Partial<LazyComponentProps> & Partial<LazyLoadImageProps>

export function LazyImage({ src, className, wrapperClassName, loaderClassName, imageClassName, alt, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <div className={cn('', className)}>
      {isLoading && (
        <div className="relative -z-10 size-full">
          <div className={cn('absolute flex items-center justify-center bg-neutral-100 z-10', loaderClassName)}>
            <Loader2 className="size-6 animate-spin text-neutral-400" />
          </div>
        </div>
      )}
      <LazyLoadImage
        threshold={1000}
        src={src}
        effect="blur"
        className={cn('size-full object-cover', imageClassName)}
        wrapperClassName={cn('size-full', wrapperClassName)}
        onLoad={() => setIsLoading(false)}
        alt={alt}
        {...props}
      />
    </div>
  )
}
