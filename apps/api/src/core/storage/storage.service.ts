import { utapi } from '@api/lib/uploadthing'

export async function uploadFile(file: File): Promise<string> {
  const [uploadResult] = await utapi.uploadFiles([file])
  const imageUrl = uploadResult?.data?.url

  if (!imageUrl) {
    throw new Error('Failed to upload image')
  }

  return imageUrl
}

export async function updateFile(oldFileUrl: string, newFile: File): Promise<string> {
  const fileKey = oldFileUrl.split('/').pop()

  if (!fileKey) {
    throw new Error('Invalid file URL')
  }

  try {
    const [_, [uploadResult]] = await Promise.all([
      utapi.deleteFiles([fileKey]),
      utapi.uploadFiles([newFile]),
    ])

    const newImageUrl = uploadResult?.data?.url

    if (!newImageUrl) {
      throw new Error('Failed to upload new image')
    }

    return newImageUrl
  }
  catch {
    throw new Error('Failed to update file')
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const fileKey = fileUrl.split('/').pop()

  if (!fileKey) {
    throw new Error('Invalid file URL')
  }

  try {
    await utapi.deleteFiles([fileKey])
  }
  catch {
    throw new Error('Failed to delete file')
  }
}
