import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useAnimation } from 'framer-motion'
import {
  boardMatrix,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  SQUARE_COLORS,
  SQUARE_EMOJIS,
  Player,
  PLAYER_COLORS,
} from '../../logic/constants'

interface BoardProps {
  players: Player[]
  playerCount: number
  currentPlayer: number
}

// ─── Visual constants ─────────────────────────────────────────────────────────
const SQUARE_SIZE = 34
const TOKEN_RADIUS = 14
/** Horizontal gap between tokens that share the same square */
const MULTI_SPACING = TOKEN_RADIUS * 2.5

// Star field layout (pseudo-random distribution)
const STAR_X_STRIDE = 79
const STAR_X_OFFSET = 23
const STAR_Y_STRIDE = 137
const STAR_Y_OFFSET = 53
const STAR_MIN_RADIUS = 0.8
const STAR_RADIUS_STEP = 0.5
const STAR_BASE_OPACITY = 0.12
const STAR_OPACITY_STEP = 0.05

// Token idle-float animation
const FLOAT_BASE_DURATION = 2.4
const FLOAT_DURATION_INC = 0.35
const FLOAT_DELAY_INC = 0.7
const FLOAT_AMPLITUDE = -10

// Pulse ring animation for active player
const PULSE_RING_MIN = TOKEN_RADIUS + 4
const PULSE_RING_MAX = TOKEN_RADIUS + 11

// ─── Candy-land zone regions (more visible borders + labels) ─────────────────
const ZONES = [
  { label: '🌲 Candy Cane Forest', rx: 300, ry: 720, rw: 440, rh: 260, fill: 'rgba(0,206,209,0.09)',  border: 'rgba(0,206,209,0.30)'  },
  { label: '⛰️ Gumdrop Mountains',  rx: 420, ry: 430, rw: 330, rh: 280, fill: 'rgba(155,89,182,0.09)', border: 'rgba(155,89,182,0.30)' },
  { label: '🍭 Lollipop Meadows',   rx: 0,   ry: 330, rw: 300, rh: 290, fill: 'rgba(255,105,180,0.09)',border: 'rgba(255,105,180,0.30)'},
  { label: '🧁 Cupcake Commons',    rx: 60,  ry: 80,  rw: 380, rh: 280, fill: 'rgba(255,215,0,0.07)', border: 'rgba(255,215,0,0.30)'  },
]

// ─── Slide connections (jumpTo squares) ──────────────────────────────────────
const JUMP_CONNECTIONS: { from: number; to: number }[] = boardMatrix
  .map((sq, i) => (sq.jumpTo !== undefined ? { from: i, to: sq.jumpTo } : null))
  .filter((x): x is { from: number; to: number } => x !== null)

function controlPoint(x1: number, y1: number, x2: number, y2: number, side = 1) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const offset = Math.min(len * 0.55, 130) * side
  return { cx: mx + (dy / len) * offset, cy: my - (dx / len) * offset }
}

function arrowHead(cx: number, cy: number, x2: number, y2: number, size: number) {
  const tx = x2 - cx
  const ty = y2 - cy
  const len = Math.sqrt(tx * tx + ty * ty) || 1
  const nx = tx / len
  const ny = ty / len
  return [
    `${x2},${y2}`,
    `${x2 - nx * size - ny * size * 0.5},${y2 - ny * size + nx * size * 0.5}`,
    `${x2 - nx * size + ny * size * 0.5},${y2 - ny * size - nx * size * 0.5}`,
  ].join(' ')
}

const RAINBOW = ['#FF0000', '#FF7700', '#FFEE00', '#00DD00', '#0055FF', '#AA00FF']

function SlideArrow({ from, to }: { from: number; to: number }) {
  const sq1 = boardMatrix[from]
  const sq2 = boardMatrix[to]
  const isForward = to > from
  const side = isForward ? 1 : -1
  const { cx, cy } = controlPoint(sq1.left, sq1.top, sq2.left, sq2.top, side)
  const pathD = `M ${sq1.left} ${sq1.top} Q ${cx} ${cy} ${sq2.left} ${sq2.top}`
  const arrow = arrowHead(cx, cy, sq2.left, sq2.top, 9)
  const labelX = cx
  const labelY = cy - 10

  if (isForward) {
    return (
      <g opacity={0.9}>
        <path d={pathD} fill="none" stroke="white" strokeWidth={10} opacity={0.06} strokeLinecap="round" />
        {RAINBOW.map((c, i) => (
          <path key={i} d={pathD} fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round"
            strokeDasharray="8 4" opacity={0.75}
            transform={`translate(${(i - 2.5) * 1.6}, ${(i - 2.5) * 0.5})`} />
        ))}
        <polygon points={arrow} fill="#FFD700" opacity={0.95} />
        <circle cx={sq1.left} cy={sq1.top} r={5} fill="#FFD700" opacity={0.85} />
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="9" fill="#FFD700" fontWeight="bold"
          stroke="rgba(0,0,0,0.6)" strokeWidth={0.6} paintOrder="stroke">
          🌈 Rainbow Bridge!
        </text>
      </g>
    )
  } else {
    return (
      <g opacity={0.85}>
        <path d={pathD} fill="none" stroke="#FF0000" strokeWidth={8} opacity={0.08} strokeLinecap="round" />
        <path d={pathD} fill="none" stroke="#8B0000" strokeWidth={4} strokeLinecap="round"
          strokeDasharray="5 5" opacity={0.6} />
        <path d={pathD} fill="none" stroke="#FF4444" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray="2 8" opacity={0.8} />
        <polygon points={arrow} fill="#FF4444" opacity={0.9} />
        <circle cx={sq1.left} cy={sq1.top} r={5} fill="#FF4444" opacity={0.85} />
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="9" fill="#FF6666" fontWeight="bold"
          stroke="rgba(0,0,0,0.7)" strokeWidth={0.6} paintOrder="stroke">
          🍬 Licorice – Back to Start!
        </text>
      </g>
    )
  }
}

// ─── Decorative scenery ───────────────────────────────────────────────────────
function Lollipop({ x, y, r = 14, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={0.4}>
      <line x1={0} y1={r} x2={0} y2={r + 30} stroke="#8B4513" strokeWidth={3} strokeLinecap="round" />
      <circle cx={0} cy={0} r={r} fill={color} />
      <circle cx={0} cy={0} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2.5} />
      <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.15} fill="rgba(255,255,255,0.45)" />
    </g>
  )
}

function CandyCane({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={0.38}>
      {/* Straight part */}
      <rect x={-4} y={-24} width={8} height={36} rx={4} fill="white" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-4} y={-22 + i * 9} width={8} height={5} rx={2} fill="#FF3333" />
      ))}
      {/* Curved hook */}
      <path d="M 0 -24 C 0 -42 14 -46 14 -46 C 26 -46 26 -36 26 -36 C 26 -26 16 -24 16 -24"
        fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" />
      <path d="M 0 -24 C 0 -42 14 -46 14 -46 C 26 -46 26 -36 26 -36 C 26 -26 16 -24 16 -24"
        fill="none" stroke="#FF3333" strokeWidth={4} strokeDasharray="6 6" strokeLinecap="round" />
    </g>
  )
}

function CottonCandy({ x, y, color = '#FF69B4', scale = 1 }: { x: number; y: number; color?: string; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={0.32}>
      <line x1={0} y1={0} x2={0} y2={32} stroke="#DEB887" strokeWidth={3} strokeLinecap="round" />
      <circle cx={0}   cy={-14} r={17} fill={color} />
      <circle cx={-11} cy={-8}  r={14} fill={color} />
      <circle cx={11}  cy={-8}  r={14} fill={color} />
      <circle cx={-6}  cy={-23} r={11} fill={color} />
      <circle cx={6}   cy={-23} r={11} fill={color} />
      <circle cx={-4}  cy={-16} r={5}  fill="rgba(255,255,255,0.28)" />
    </g>
  )
}

function Gumdrop({ x, y, color = '#7CFC00', r = 11 }: { x: number; y: number; color?: string; r?: number }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={0.38}>
      <ellipse cx={0} cy={0}       rx={r}        ry={r * 1.25} fill={color} />
      <ellipse cx={0} cy={-r * 0.5} rx={r * 0.5} ry={r * 0.35} fill="rgba(255,255,255,0.32)" />
      <circle  cx={r * 0.25} cy={r * 0.25} r={r * 0.14} fill="rgba(255,255,255,0.22)" />
    </g>
  )
}

function Sparkle({ x, y, size = 8, color = '#FFD700', delay = 0 }: {
  x: number; y: number; size?: number; color?: string; delay?: number
}) {
  return (
    <motion.g transform={`translate(${x},${y})`}
      animate={{ rotate: [0, 360], scale: [0.8, 1.3, 0.8], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'linear', delay }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1={0} y1={-size} x2={0} y2={size}
          stroke={color} strokeWidth={1.5} strokeLinecap="round" transform={`rotate(${angle})`} />
      ))}
    </motion.g>
  )
}

// ─── Candy token characters (expressive faces, distinct shapes) ───────────────

/** Gingerbread person: frosting crown, big eyes, rosy cheeks, sweet smile */
function GingerbreadToken({ color }: { color: string }) {
  return (
    <g>
      {/* Frosting crown */}
      <path d="M-9,-13 L-6,-18 L-3,-14 L0,-20 L3,-14 L6,-18 L9,-13 Z"
        fill="rgba(255,255,255,0.88)" stroke={color} strokeWidth={0.6} />
      {/* Icing wavy collar */}
      <path d="M-12,-1 Q-9,-3 -6,-1 M6,-1 Q9,-3 12,-1"
        stroke="rgba(255,255,255,0.40)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx={-4.8} cy={-4} r={3.4} fill="white" opacity={0.95} />
      <circle cx={4.8}  cy={-4} r={3.4} fill="white" opacity={0.95} />
      <circle cx={-4.8} cy={-4} r={1.9} fill="#2C1810" />
      <circle cx={4.8}  cy={-4} r={1.9} fill="#2C1810" />
      <circle cx={-3.8} cy={-4.9} r={0.9} fill="white" />
      <circle cx={5.8}  cy={-4.9} r={0.9} fill="white" />
      {/* Rosy cheeks */}
      <circle cx={-7.5} cy={-0.5} r={3.2} fill="#FF69B4" opacity={0.50} />
      <circle cx={7.5}  cy={-0.5} r={3.2} fill="#FF69B4" opacity={0.50} />
      {/* Wide smile */}
      <path d="M-5.5,2.5 Q0,7.5 5.5,2.5"
        fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" />
      {/* Icing buttons */}
      <circle cx={0} cy={6}   r={1.6} fill="rgba(255,255,255,0.75)" />
      <circle cx={0} cy={10}  r={1.4} fill="rgba(255,255,255,0.60)" />
    </g>
  )
}

/** Pre-calculated spoke endpoints for the peppermint swirl lines (angles 0°, 60°, 120°) */
const PEPPERMINT_SPOKES = [0, 60, 120].map((deg) => {
  const rad = deg * Math.PI / 180
  return { x: Math.cos(rad) * 13, y: Math.sin(rad) * 13 }
})

/** Peppermint swirl character: star bow, swirl lines, eyelashes */
function PeppermintToken({ color }: { color: string }) {
  return (
    <g>
      {/* Peppermint swirl lines on body */}
      {PEPPERMINT_SPOKES.map(({ x, y }, i) => (
        <path key={i}
          d={`M0,0 L${x} ${y}`}
          stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* Star accent at top */}
      <text textAnchor="middle" y={-12} fontSize="11" opacity={0.90}>⭐</text>
      {/* Eyes */}
      <circle cx={-4.8} cy={-3} r={3.2} fill="white" opacity={0.95} />
      <circle cx={4.8}  cy={-3} r={3.2} fill="white" opacity={0.95} />
      <circle cx={-4.8} cy={-3} r={1.7} fill={color} />
      <circle cx={4.8}  cy={-3} r={1.7} fill={color} />
      <circle cx={-3.8} cy={-3.9} r={0.8} fill="white" />
      <circle cx={5.8}  cy={-3.9} r={0.8} fill="white" />
      {/* Eyelashes */}
      <line x1={-7} y1={-5.5} x2={-6} y2={-4} stroke="white" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
      <line x1={-2.5} y1={-6.5} x2={-3} y2={-5} stroke="white" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
      {/* Cheeks */}
      <circle cx={-7.5} cy={0.5} r={2.8} fill="#FFB6C1" opacity={0.55} />
      <circle cx={7.5}  cy={0.5} r={2.8} fill="#FFB6C1" opacity={0.55} />
      {/* Smile */}
      <path d="M-5,2 Q0,6.5 5,2"
        fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

/** Lollipop character: swirl body, bow accessory, playful wide smile */
function LollipopToken({ color }: { color: string }) {
  return (
    <g>
      {/* Swirl on body */}
      <path d="M0,-12 C6,-10 9,-4 5,0 C3,3 -3,3 -5,0 C-8,-6 0,-10 0,-12"
        fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth={3.5} strokeLinecap="round" />
      {/* Bow/flower at top */}
      <circle cx={0}  cy={-15} r={5.5} fill="rgba(255,255,255,0.75)" stroke={color} strokeWidth={0.8} />
      <circle cx={0}  cy={-15} r={2.5} fill={color} opacity={0.8} />
      <line x1={0} y1={-9.5} x2={0} y2={-12} stroke="rgba(255,255,255,0.60)" strokeWidth={1.5} />
      {/* Eyes */}
      <circle cx={-4.8} cy={-4} r={3.4} fill="white" opacity={0.95} />
      <circle cx={4.8}  cy={-4} r={3.4} fill="white" opacity={0.95} />
      <circle cx={-4.8} cy={-4} r={2.1} fill="#4B0082" />
      <circle cx={4.8}  cy={-4} r={2.1} fill="#4B0082" />
      <circle cx={-3.6} cy={-5} r={1.0} fill="white" />
      <circle cx={6.0}  cy={-5} r={1.0} fill="white" />
      {/* Cheeks */}
      <circle cx={-7.5} cy={0} r={3} fill="#FF1493" opacity={0.42} />
      <circle cx={7.5}  cy={0} r={3} fill="#FF1493" opacity={0.42} />
      {/* Big open smile */}
      <path d="M-5.5,2 Q0,7.5 5.5,2"
        fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  )
}

/** Gummy bear: ears sticking above, muzzle, bear features */
function GummyToken({ color }: { color: string }) {
  return (
    <g>
      {/* Ears (above the circle) */}
      <circle cx={-8.5} cy={-13} r={6}   fill={color} stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />
      <circle cx={8.5}  cy={-13} r={6}   fill={color} stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />
      <circle cx={-8.5} cy={-13} r={3.5} fill="rgba(255,255,255,0.22)" />
      <circle cx={8.5}  cy={-13} r={3.5} fill="rgba(255,255,255,0.22)" />
      {/* Muzzle */}
      <ellipse cx={0} cy={4.5} rx={5.5} ry={4} fill="rgba(255,255,255,0.22)" />
      {/* Eyes */}
      <circle cx={-5}  cy={-3} r={3.4} fill="white" opacity={0.95} />
      <circle cx={5}   cy={-3} r={3.4} fill="white" opacity={0.95} />
      <circle cx={-5}  cy={-3} r={1.9} fill="#1a0010" />
      <circle cx={5}   cy={-3} r={1.9} fill="#1a0010" />
      <circle cx={-4}  cy={-3.9} r={0.8} fill="white" />
      <circle cx={6}   cy={-3.9} r={0.8} fill="white" />
      {/* Nose */}
      <ellipse cx={0} cy={2.5} rx={2.8} ry={1.8} fill="rgba(0,0,0,0.38)" />
      {/* Smile */}
      <path d="M-3,5.5 Q0,8 3,5.5"
        fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth={1.8} strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx={-7.5} cy={1.5} r={2.8} fill="#FF69B4" opacity={0.38} />
      <circle cx={7.5}  cy={1.5} r={2.8} fill="#FF69B4" opacity={0.38} />
    </g>
  )
}

const TOKEN_SHAPES = [GingerbreadToken, PeppermintToken, LollipopToken, GummyToken]

// ─── Player Token ─────────────────────────────────────────────────────────────
function PlayerToken({
  player,
  index,
  playerCount,
  isCurrentPlayer,
  dx,
  dy,
}: {
  player: Player
  index: number
  playerCount: number
  isCurrentPlayer: boolean
  /** Horizontal offset when sharing a square with other players */
  dx: number
  /** Vertical offset when sharing a square with other players */
  dy: number
}) {
  // Show at START (boardMatrix[0]) when player hasn't moved yet (position = -1)
  const displayPos = Math.max(0, player.position)
  const sq = displayPos < boardMatrix.length ? boardMatrix[displayPos] : null

  // Centre on the square, then apply the sharing offset
  const targetX = sq ? sq.left + dx : -200
  const targetY = sq ? sq.top  + dy : -200

  const motionX = useMotionValue(targetX)
  const motionY = useMotionValue(targetY)
  const springX = useSpring(motionX, { stiffness: 110, damping: 20 })
  const springY = useSpring(motionY, { stiffness: 110, damping: 20 })

  // Fired imperatively so a 4.5× burst plays once when this player's turn starts
  const scaleCtrl = useAnimation()

  useEffect(() => {
    motionX.set(targetX)
    motionY.set(targetY)
  }, [targetX, targetY, motionX, motionY])

  useEffect(() => {
    if (isCurrentPlayer) {
      scaleCtrl.start({
        scale: [1, 4.5, 1],
        transition: { duration: 0.85, ease: 'easeInOut', times: [0, 0.35, 1] },
      })
    }
  }, [isCurrentPlayer, scaleCtrl])

  // Off-screen placeholder still calls hooks — must return after hooks
  if (index >= playerCount) return null

  const color = PLAYER_COLORS[index]
  const TokenShape = TOKEN_SHAPES[index]

  return (
    <motion.g style={{ x: springX, y: springY }}>
      {/* Scale-up burst when turn starts, centred on the token body */}
      <motion.g animate={scaleCtrl} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {/* Idle float */}
        <motion.g
          animate={{ y: [0, FLOAT_AMPLITUDE, 0] }}
          transition={{
            duration: FLOAT_BASE_DURATION + index * FLOAT_DURATION_INC,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * FLOAT_DELAY_INC,
          }}
        >
          {/* Drop shadow */}
          <ellipse rx={TOKEN_RADIUS * 0.75} ry={4} cy={TOKEN_RADIUS + 2} fill="rgba(0,0,0,0.40)" />

          {/* Pulsing ring for active player */}
          {isCurrentPlayer && (
            <motion.circle
              r={TOKEN_RADIUS + 6}
              fill="none"
              stroke={color}
              strokeWidth={3}
              animate={{ opacity: [0.9, 0.1, 0.9], r: [PULSE_RING_MIN, PULSE_RING_MAX, PULSE_RING_MIN] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          )}

          {/* Token body */}
          <circle r={TOKEN_RADIUS + 2} fill={color} opacity={0.88} />
          <circle r={TOKEN_RADIUS + 2} fill="none" stroke="white" strokeWidth={1.8} opacity={0.55} />
          {/* Subtle bottom shadow for depth */}
          <ellipse cx={0} cy={TOKEN_RADIUS * 0.7} rx={TOKEN_RADIUS * 0.8} ry={TOKEN_RADIUS * 0.25}
            fill="rgba(0,0,0,0.25)" />
          <TokenShape color={color} />

          {/* Player initial label below token */}
          <text
            textAnchor="middle" dominantBaseline="central"
            fontSize="8" fill="white" fontWeight="bold"
            y={TOKEN_RADIUS + 10}
            style={{ userSelect: 'none' }}
            stroke="rgba(0,0,0,0.5)" strokeWidth={0.6} paintOrder="stroke"
          >
            {player.name.charAt(0).toUpperCase()}
          </text>
        </motion.g>
      </motion.g>
    </motion.g>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────
export default function Board({ players, playerCount, currentPlayer }: BoardProps) {
  const endSq = boardMatrix[boardMatrix.length - 1]

  // Build position→[playerIndexes] so tokens on the same square spread horizontally
  // Players at position -1 (pre-game) are treated as being at START (position 0)
  const squareGroups = new Map<number, number[]>()
  for (let i = 0; i < playerCount; i++) {
    const pos = Math.max(0, players[i].position)
    squareGroups.set(pos, [...(squareGroups.get(pos) ?? []), i])
  }

  function getOffset(playerIndex: number): { dx: number; dy: number } {
    const pos = Math.max(0, players[playerIndex].position)
    const group = squareGroups.get(pos) ?? [playerIndex]
    const N = group.length
    const rank = group.indexOf(playerIndex)
    return { dx: (rank - (N - 1) / 2) * MULTI_SPACING, dy: 0 }
  }

  // Compute path points string once and reuse across all polylines
  const pathPoints = boardMatrix.map((sq) => `${sq.left},${sq.top}`).join(' ')

  return (
    <div className="relative overflow-auto max-w-full">
      <svg
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        role="img"
        aria-label="Candyland game board"
        style={{
          background: 'linear-gradient(160deg, #1a0030 0%, #2d0050 30%, #3a1060 60%, #1a0840 100%)',
          display: 'block',
        }}
        className="rounded-2xl shadow-2xl border-4 border-pink-500"
      >
        {/* ── Star field ── */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i}
            cx={(i * STAR_X_STRIDE + STAR_X_OFFSET) % BOARD_WIDTH}
            cy={(i * STAR_Y_STRIDE + STAR_Y_OFFSET) % BOARD_HEIGHT}
            r={STAR_MIN_RADIUS + (i % 3) * STAR_RADIUS_STEP}
            fill="white"
            opacity={STAR_BASE_OPACITY + (i % 5) * STAR_OPACITY_STEP}
          />
        ))}

        {/* ── Zone backgrounds ── */}
        {ZONES.map((z, i) => (
          <g key={i}>
            <rect x={z.rx} y={z.ry} width={z.rw} height={z.rh} rx={18}
              fill={z.fill} stroke={z.border} strokeWidth={1.5} />
            <text x={z.rx + z.rw / 2} y={z.ry + 17}
              textAnchor="middle" fontSize="10"
              fill="rgba(255,255,255,0.55)" fontStyle="italic" fontWeight="bold">
              {z.label}
            </text>
          </g>
        ))}

        {/* ── Candy scenery: lollipops, candy canes, cotton candy, gumdrops ── */}
        <Lollipop x={48}  y={195} r={18} color="#FF4444" />
        <Lollipop x={710} y={495} r={15} color="#9B59B6" />
        <Lollipop x={375} y={95}  r={17} color="#F1C40F" />
        <Lollipop x={605} y={860} r={18} color="#3498DB" />
        <Lollipop x={130} y={510} r={14} color="#2ECC71" />
        <Lollipop x={490} y={290} r={13} color="#E74C3C" />

        <CandyCane x={740} y={320} scale={0.9} />
        <CandyCane x={20}  y={650} scale={0.8} />
        <CandyCane x={660} y={140} scale={0.7} />

        <CottonCandy x={680} y={640} color="#FF69B4" scale={1.1} />
        <CottonCandy x={100} y={280} color="#87CEEB" scale={0.9} />
        <CottonCandy x={340} y={490} color="#DDA0DD" scale={0.85} />

        <Gumdrop x={555} y={130} color="#FF6347" r={13} />
        <Gumdrop x={200} y={740} color="#7CFC00" r={11} />
        <Gumdrop x={420} y={640} color="#FFD700" r={10} />
        <Gumdrop x={640} y={780} color="#FF69B4" r={12} />
        <Gumdrop x={80}  y={430} color="#00CED1" r={10} />

        {/* ── Path glow (thicker candy road layers) ── */}
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,255,255,0.04)" strokeWidth={56}
          strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={42}
          strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,255,255,0.12)" strokeWidth={28}
          strokeLinejoin="round" strokeLinecap="round" />
        {/* Candy-cane dashed accent */}
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,68,68,0.22)" strokeWidth={14}
          strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray="22 16" />

        {/* ── Slide/shortcut arrows ── */}
        {JUMP_CONNECTIONS.map(({ from, to }) => (
          <SlideArrow key={`jump-${from}-${to}`} from={from} to={to} />
        ))}

        {/* ── Board squares ── */}
        {boardMatrix.map((sq, i) => {
          const color = SQUARE_COLORS[sq.type] ?? '#888'
          const emoji = SQUARE_EMOJIS[sq.type]
          const isEnd = sq.type === 'end'
          const isSpecial = Boolean(emoji) || isEnd
          const isJumpSource = sq.jumpTo !== undefined
          const size = isEnd ? SQUARE_SIZE + 10 : isSpecial ? SQUARE_SIZE + 5 : SQUARE_SIZE
          const rx = isEnd ? size / 2 : isSpecial ? 9 : 6
          return (
            <g key={i} transform={`translate(${sq.left},${sq.top})`}>
              {(isSpecial || isJumpSource) && (
                <circle r={size * 1.0} fill={color} opacity={isJumpSource ? 0.24 : 0.18} />
              )}
              {/* Tile body */}
              <rect x={-size / 2} y={-size / 2} width={size} height={size}
                rx={rx} fill={color}
                stroke={isJumpSource ? 'white' : isSpecial ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)'}
                strokeWidth={isJumpSource || isSpecial ? 2.5 : 1.5}
              />
              {/* Shine highlight — top arc, 3D candy tile look */}
              <ellipse cx={0} cy={-size * 0.22} rx={size * 0.42} ry={size * 0.22}
                fill="rgba(255,255,255,0.30)" />
              {/* Emoji for special squares */}
              {emoji && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={isEnd ? 18 : 15}>{emoji}</text>
              )}
              {isEnd && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={18}>🏆</text>
              )}
              {isJumpSource && (
                <text textAnchor="middle" dominantBaseline="central" fontSize="10"
                  y={size / 2 + 9} fill="white" opacity={0.9}>⚡</text>
              )}
            </g>
          )
        })}

        {/* ── START / FINISH labels ── */}
        <text x={110} y={968} textAnchor="middle" fontSize="11" fill="#FFD700" fontWeight="bold" opacity={0.9}
          stroke="rgba(0,0,0,0.5)" strokeWidth={0.6} paintOrder="stroke">★ START</text>
        <text x={endSq.left} y={endSq.top - 24} textAnchor="middle" fontSize="11" fill="#FFD700" fontWeight="bold" opacity={0.9}
          stroke="rgba(0,0,0,0.5)" strokeWidth={0.6} paintOrder="stroke">🏰 FINISH</text>

        {/* Sparkles around finish */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180
          return (
            <Sparkle key={i}
              x={endSq.left + Math.cos(angle) * 28}
              y={endSq.top  + Math.sin(angle) * 28}
              size={5 + (i % 2) * 2}
              color={i % 2 === 0 ? '#FFD700' : '#FF69B4'}
              delay={i * 0.4}
            />
          )
        })}

        {/* ── Player tokens (on top of everything) ── */}
        {players.map((player, i) => {
          const { dx, dy } = getOffset(i)
          return (
            <PlayerToken
              key={i}
              player={player}
              index={i}
              playerCount={playerCount}
              isCurrentPlayer={i === currentPlayer}
              dx={dx}
              dy={dy}
            />
          )
        })}
      </svg>
    </div>
  )
}
