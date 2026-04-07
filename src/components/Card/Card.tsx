import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card as CardType, SQUARE_COLORS, SQUARE_EMOJIS } from '../../logic/constants'

interface DrawnCardProps {
  card: CardType
}

const COLOR_LABELS: Record<string, string> = {
  red: 'Red',
  purple: 'Purple',
  yellow: 'Yellow',
  blue: 'Blue',
  orange: 'Orange',
  green: 'Green',
}

function CardFace({ card }: { card: NonNullable<CardType> }) {
  const isDouble = card.type.startsWith('double')
  const colorKey = isDouble ? card.type.replace('double-', '') : card.type
  const bgColor = SQUARE_COLORS[colorKey] ?? '#888'
  const emoji = SQUARE_EMOJIS[colorKey]
  const label = COLOR_LABELS[colorKey] ?? colorKey

  if (isDouble) {
    return (
      <div
        className="w-20 h-28 rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-white/50 shadow-lg"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            ${bgColor},
            ${bgColor} 8px,
            ${bgColor}99 8px,
            ${bgColor}99 16px
          )`,
        }}
      >
        <span className="text-white font-bold text-xs drop-shadow">DOUBLE</span>
        <div
          className="w-6 h-6 rounded-full border-2 border-white/70"
          style={{ background: bgColor }}
        />
        <div
          className="w-6 h-6 rounded-full border-2 border-white/70"
          style={{ background: bgColor }}
        />
        <span className="text-white font-bold text-xs drop-shadow">{label}</span>
      </div>
    )
  }

  if (emoji) {
    return (
      <div
        className="w-20 h-28 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-white/50 shadow-lg"
        style={{ background: `radial-gradient(circle, ${bgColor}dd, ${bgColor})` }}
      >
        <span className="text-3xl">{emoji}</span>
        <span className="text-white font-bold text-xs capitalize drop-shadow">{colorKey}</span>
      </div>
    )
  }

  return (
    <div
      className="w-20 h-28 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-white/50 shadow-lg"
      style={{ background: `radial-gradient(circle, ${bgColor}ee, ${bgColor}aa)` }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-white/60" style={{ background: bgColor }} />
      <span className="text-white font-bold text-xs capitalize drop-shadow">{label}</span>
    </div>
  )
}

function CardBack() {
  return (
    <div
      className="w-20 h-28 rounded-xl border-2 border-pink-400 shadow-lg flex items-center justify-center"
      style={{
        background: `repeating-linear-gradient(
          45deg,
          #FF4444,
          #FF4444 8px,
          white 8px,
          white 16px
        )`,
      }}
    >
      <span className="text-2xl">🍬</span>
    </div>
  )
}

export default function DrawnCard({ card }: DrawnCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [displayCard, setDisplayCard] = useState<NonNullable<CardType> | null>(null)

  useEffect(() => {
    if (card) {
      setFlipped(false)
      const timer = setTimeout(() => {
        setDisplayCard(card)
        setFlipped(true)
      }, 120)
      return () => clearTimeout(timer)
    } else {
      setFlipped(false)
      setDisplayCard(null)
    }
  }, [card])

  if (!card) return <CardBack />

  return (
    <div style={{ perspective: 600 }} className="w-20 h-28">
      <motion.div
        animate={{ rotateY: flipped ? 0 : 180 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
      >
        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%' }}>
          {displayCard ? <CardFace card={displayCard} /> : <CardBack />}
        </div>
        <div
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardBack />
        </div>
      </motion.div>
    </div>
  )
}
