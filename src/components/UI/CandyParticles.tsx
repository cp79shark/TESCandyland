import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: number
  delay: number
  duration: number
  emoji: string
  size: number
}

const CANDY_EMOJIS = ['🍬', '🍭', '🍦', '🧁', '🍪', '🍫', '🍧']

export default function CandyParticles({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        emoji: CANDY_EMOJIS[Math.floor(Math.random() * CANDY_EMOJIS.length)],
        size: 16 + Math.floor(Math.random() * 16),
      })),
    )
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-candyfall select-none"
          style={{
            left: `${p.left}%`,
            top: '-60px',
            fontSize: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
