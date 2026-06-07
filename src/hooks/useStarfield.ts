import { useEffect, useState } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
}

function createStar() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: 0.5 + Math.random() * 1.2,
    opacity: 0.2 + Math.random() * 0.6,
  }
}

export function useStarfield(count = 30) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(Array.from({ length: count }, () => createStar()))
  }, [count])

  return { stars }
}
