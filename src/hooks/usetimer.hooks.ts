import { useEffect, useRef, useState } from "react"
import { Nullable } from "../pkg/safecatch/safecatch.type"

interface UseTimerProps {
  onExpire: () => void
  delay: number
}

export const useTimer = (props: UseTimerProps) => {
  const [seconds, setSeconds] = useState(0)
  const activeInterval = useRef<Nullable<NodeJS.Timer>>(null)

  useEffect(() => () => deleteActiveInterval(), [])

  const start = (ends: Date) => {
    deleteActiveInterval()

    activeInterval.current = setInterval(() => {
      const secondsLeft = ends.getTime() - Date.now()
      if (secondsLeft < 0) {
        deleteActiveInterval()
        setTimeout(() => props.onExpire(), props.delay)
        return
      }

      setSeconds(secondsLeft)
    }, 1000)
  }

  useEffect(() => { if (seconds <= 0) deleteActiveInterval() }, [seconds])

  const deleteActiveInterval = () => {
    if (activeInterval.current == null) return

    clearInterval(activeInterval.current)
  }

  return { seconds, start }
}


export const ConvertSecondsLeftToString = (secondsLeft: number) => {
  const days = Math.floor(secondsLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((secondsLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((secondsLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((secondsLeft % (1000 * 60)) / 1000);

  const message = []
  if (days != 0) message.push(days, days == 1 ? "day" : "days")
  if (hours != 0) message.push(hours, hours == 1 ? "hour" : "hours")
  if (minutes != 0) message.push(minutes, minutes == 1 ? "minute" : "minutes")
  message.push(seconds, seconds <= 1 ? "second" : "seconds")

  return message.length > 0 ? message.join(" ") + " left" : ""
}