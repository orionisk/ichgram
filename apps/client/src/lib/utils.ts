import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  )

  const intervals = {
    y: 31536000,
    mo: 2592000,
    wek: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}`
    }
  }

  return '0s'
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace(/,/g, ' ')
}
