import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
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
        <div className="w-6 h-6 rounded-full border-2 border-white/70" style={{ background: bgColor }} />
        <div className="w-6 h-6 rounded-full border-2 border-white/70" style={{ background: bgColor }} />
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
  // `displayCard` is what's currently rendered on the card face — swapped while edge-on.
  const [displayCard, setDisplayCard] = useState<NonNullable<CardType> | null>(null)
  const controls = useAnimation()

  // Track the most recently requested card and whether a flip is in flight.
  const latestCardRef = useRef<NonNullable<CardType> | null>(null)
  const isFlippingRef  = useRef(false)

  useEffect(() => {
    if (!card) {
      // Card cleared (shouldn't happen mid-game, but guard it)
      latestCardRef.current = null
      setDisplayCard(null)
      controls.set({ rotateY: 0 })
      isFlippingRef.current = false
      return
    }

    latestCardRef.current = card

    // If a flip is already running it will pick up latestCardRef when it finishes.
    if (isFlippingRef.current) return

    const runFlip = async () => {
      isFlippingRef.current = true
      try {
        // ── Phase 1: tilt the current face away (0° → 90°) ──────────────────────
        await controls.start({
          rotateY: 90,
          transition: { duration: 0.38, ease: 'easeIn' },
        })
        // ── Swap content while the card is edge-on ───────────────────────────────
        const next = latestCardRef.current
        latestCardRef.current = null
        setDisplayCard(next)
        // ── Jump to −90° (other side of edge-on, invisible) ──────────────────────
        controls.set({ rotateY: -90 })
        // ── Phase 2: swing the new face toward the viewer (−90° → 0°) ───────────
        await controls.start({
          rotateY: 0,
          transition: { duration: 0.50, ease: 'easeOut' },
        })
      } finally {
        isFlippingRef.current = false
        // If another card arrived during the flip, run again immediately.
        if (latestCardRef.current) runFlip()
      }
    }

    runFlip()
  // `controls` is a stable object ref returned by useAnimation() — it never changes
  // between renders, so omitting it from the dependency array is safe and intentional.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card])

  return (
    // perspective gives the 3D depth cue for the Y rotation
    <div style={{ perspective: 800 }} className="w-20 h-28">
      <motion.div
        animate={controls}
        initial={{ rotateY: 0 }}
        style={{ width: '100%', height: '100%' }}
      >
        {displayCard ? <CardFace card={displayCard} /> : <CardBack />}
      </motion.div>
    </div>
  )
}
