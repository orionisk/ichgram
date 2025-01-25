import { useEffect, useRef, useState } from 'react'

function getTimeAgo(date: Date | string) {
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
      return {
        text: `${interval} ${unit}`,
        seconds,
      }
    }
  }

  return {
    text: '0s',
    seconds: 0,
  }
}

function getUpdateInterval(seconds: number) {
  if (seconds < 60)
    return 1000
  if (seconds < 3600)
    return 60000
  if (seconds < 86400)
    return 3600000
  return 86400000
}

export function useTimeAgo(date?: Date | string) {
  if (!date)
    return null

  const [timeAgo, setTimeAgo] = useState(() => getTimeAgo(date))
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const newTimeAgo = getTimeAgo(date)
      setTimeAgo(newTimeAgo)
      return newTimeAgo.seconds
    }

    const scheduleNextUpdate = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      const seconds = updateTime()
      const interval = getUpdateInterval(seconds)

      timerRef.current = setInterval(() => {
        scheduleNextUpdate()
      }, interval)
    }

    scheduleNextUpdate()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [date])

  return timeAgo.text
}
