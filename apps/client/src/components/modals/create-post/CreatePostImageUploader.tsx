import fileUploadIcon from '@/assets/file-upload.png'

import { LazyLoadImage } from 'react-lazy-load-image-component'

interface ImageUploaderProps {
  selectedImage: string | null
  onImageSelect: (image: File) => void
}

export function CreatePostImageUploader({
  selectedImage,
  onImageSelect,
}: ImageUploaderProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  if (selectedImage) {
    return (
      <div className="relative size-full">
        <label
          htmlFor="image-upload"
          className="group relative block size-full cursor-pointer"
        >
          <LazyLoadImage
            src={selectedImage}
            alt="Selected"
            className="size-full object-contain"
            wrapperClassName="size-full"
          />
        </label>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleImageUpload}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center border-none outline-none">
      <label
        htmlFor="image-upload"
        className="flex size-full cursor-pointer items-center justify-center bg-[#FAFAFA]"
      >
        <img src={fileUploadIcon} alt="Click to upload a post" className="" />
        <span className="sr-only">Choose a photo to share</span>
      </label>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageUpload}
      />
    </div>
  )
}
