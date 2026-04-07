import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
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

// Visual constants
const SQUARE_SIZE = 24
const TOKEN_RADIUS = 10
const TOKEN_SPACING = 12      // px offset so multiple tokens on same square don't overlap

// Star field layout constants
const STAR_X_STRIDE = 79      // spacing multiplier for pseudo-random X spread
const STAR_X_OFFSET = 23
const STAR_Y_STRIDE = 137     // spacing multiplier for pseudo-random Y spread
const STAR_Y_OFFSET = 53
const STAR_MIN_RADIUS = 0.8
const STAR_RADIUS_STEP = 0.5
const STAR_BASE_OPACITY = 0.12
const STAR_OPACITY_STEP = 0.05

// Token idle-float animation
const FLOAT_BASE_DURATION = 2.4   // seconds for player 0's float cycle
const FLOAT_DURATION_INC = 0.35   // additional seconds per player index
const FLOAT_DELAY_INC = 0.7       // seconds stagger between players
const FLOAT_AMPLITUDE = -7        // px upward displacement at peak

// Pulse ring animation for active player
const PULSE_RING_MIN_OFFSET = TOKEN_RADIUS + 3   // r at animation start/end
const PULSE_RING_MAX_OFFSET = TOKEN_RADIUS + 9   // r at animation peak

// ─── Candy-land zone regions ──────────────────────────────────────────────────
const ZONES = [
  { label: 'Candy Cane Forest 🌲', rx: 300, ry: 720, rw: 440, rh: 260, color: 'rgba(0,206,209,0.05)' },
  { label: 'Gumdrop Mountains 🍬', rx: 420, ry: 430, rw: 330, rh: 280, color: 'rgba(155,89,182,0.05)' },
  { label: 'Lollipop Meadows 🍭', rx: 0,   ry: 330, rw: 300, rh: 290, color: 'rgba(255,105,180,0.05)' },
  { label: 'Cupcake Commons 🧁',   rx: 60,  ry: 80,  rw: 380, rh: 280, color: 'rgba(255,215,0,0.04)'  },
]

// ─── Shortcut / licorice slide connections ────────────────────────────────────
const JUMP_CONNECTIONS: { from: number; to: number }[] = boardMatrix
  .map((sq, i) => (sq.jumpTo !== undefined ? { from: i, to: sq.jumpTo } : null))
  .filter((x): x is { from: number; to: number } => x !== null)

/** Compute a quadratic bezier control point perpendicular to the midpoint */
function controlPoint(x1: number, y1: number, x2: number, y2: number, side = 1) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const offset = Math.min(len * 0.55, 130) * side
  return { cx: mx + (dy / len) * offset, cy: my - (dx / len) * offset }
}

/** Arrow head polygon at the END of a quadratic bezier P0→Ctrl→P2 */
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

// Rainbow colors for shortcut arcs
const RAINBOW = ['#FF0000', '#FF7700', '#FFEE00', '#00DD00', '#0055FF', '#AA00FF']

function SlideArrow({ from, to }: { from: number; to: number }) {
  const sq1 = boardMatrix[from]
  const sq2 = boardMatrix[to]
  const isForward = to > from
  // Alternate arc sides so overlapping arcs don't hide each other
  const side = isForward ? 1 : -1
  const { cx, cy } = controlPoint(sq1.left, sq1.top, sq2.left, sq2.top, side)
  const pathD = `M ${sq1.left} ${sq1.top} Q ${cx} ${cy} ${sq2.left} ${sq2.top}`
  const arrow = arrowHead(cx, cy, sq2.left, sq2.top, 9)

  // Label position slightly above control point
  const labelX = cx
  const labelY = cy - 10

  if (isForward) {
    // Rainbow shortcut bridge
    return (
      <g opacity={0.9}>
        {/* Glow backdrop */}
        <path d={pathD} fill="none" stroke="white" strokeWidth={10} opacity={0.06} strokeLinecap="round" />
        {/* Rainbow stripes */}
        {RAINBOW.map((c, i) => (
          <path
            key={i}
            d={pathD}
            fill="none"
            stroke={c}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeDasharray="8 4"
            opacity={0.75}
            transform={`translate(${(i - 2.5) * 1.6}, ${(i - 2.5) * 0.5})`}
          />
        ))}
        {/* Arrow */}
        <polygon points={arrow} fill="#FFD700" opacity={0.95} />
        {/* Source dot */}
        <circle cx={sq1.left} cy={sq1.top} r={5} fill="#FFD700" opacity={0.85} />
        {/* Label */}
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="9" fill="#FFD700" fontWeight="bold"
          stroke="rgba(0,0,0,0.6)" strokeWidth={0.6} paintOrder="stroke">
          🌈 Rainbow Bridge!
        </text>
      </g>
    )
  } else {
    // Licorice trap – back to start
    return (
      <g opacity={0.85}>
        {/* Glow */}
        <path d={pathD} fill="none" stroke="#FF0000" strokeWidth={8} opacity={0.08} strokeLinecap="round" />
        {/* Licorice rope */}
        <path d={pathD} fill="none" stroke="#8B0000" strokeWidth={4} strokeLinecap="round"
          strokeDasharray="5 5" opacity={0.6} />
        <path d={pathD} fill="none" stroke="#FF4444" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray="2 8" opacity={0.8} />
        {/* Arrow */}
        <polygon points={arrow} fill="#FF4444" opacity={0.9} />
        {/* Source marker */}
        <circle cx={sq1.left} cy={sq1.top} r={5} fill="#FF4444" opacity={0.85} />
        {/* Label */}
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="9" fill="#FF6666" fontWeight="bold"
          stroke="rgba(0,0,0,0.7)" strokeWidth={0.6} paintOrder="stroke">
          🍬 Licorice – Back to Start!
        </text>
      </g>
    )
  }
}

// ─── Decorative lollipop ──────────────────────────────────────────────────────
function Lollipop({ x, y, r = 14, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={0.22}>
      <line x1={0} y1={r} x2={0} y2={r + 24} stroke="#8B4513" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={0} cy={0} r={r} fill={color} />
      <circle cx={0} cy={0} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.12} fill="rgba(255,255,255,0.4)" />
    </g>
  )
}

// ─── Animated sparkle near finish ─────────────────────────────────────────────
function Sparkle({ x, y, size = 8, color = '#FFD700', delay = 0 }: { x: number; y: number; size?: number; color?: string; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x},${y})`}
      animate={{ rotate: [0, 360], scale: [0.8, 1.3, 0.8], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'linear', delay }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      {[0, 45, 90, 135].map((angle) => (
        <line key={angle} x1={0} y1={-size} x2={0} y2={size}
          stroke={color} strokeWidth={1.5} strokeLinecap="round"
          transform={`rotate(${angle})`} />
      ))}
    </motion.g>
  )
}

// ─── Player Token ─────────────────────────────────────────────────────────────
// Token offsets so 4 players on the same square don't fully overlap
const TOKEN_OFFSETS = [
  { dx: -TOKEN_SPACING, dy: -TOKEN_SPACING },
  { dx:  TOKEN_SPACING, dy: -TOKEN_SPACING },
  { dx: -TOKEN_SPACING, dy:  TOKEN_SPACING },
  { dx:  TOKEN_SPACING, dy:  TOKEN_SPACING },
]

// Candy-themed token shapes
function CupcakeToken({ color }: { color: string }) {
  return (
    <g>
      <rect x={-8} y={-2} width={16} height={10} rx={2} fill={color} />
      <ellipse cx={0} cy={-2} rx={9} ry={6} fill={color} />
      <ellipse cx={0} cy={-5} rx={6} ry={4} fill="white" opacity={0.6} />
      <rect x={-1} y={-10} width={2} height={6} fill="#FF69B4" />
      <circle cx={0} cy={-11} r={2} fill="#FF4444" />
    </g>
  )
}
function PopsicleToken({ color }: { color: string }) {
  return (
    <g>
      <rect x={-2} y={2} width={4} height={9} rx={1} fill="#D2B48C" />
      <rect x={-7} y={-10} width={14} height={14} rx={4} fill={color} />
      <rect x={-7} y={-5} width={14} height={3} fill="rgba(255,255,255,0.25)" />
    </g>
  )
}
function LollipopToken({ color }: { color: string }) {
  return (
    <g>
      <line x1={0} y1={5} x2={0} y2={11} stroke="#8B4513" strokeWidth={2} strokeLinecap="round" />
      <circle cx={0} cy={-2} r={9} fill={color} />
      <circle cx={0} cy={-2} r={5} fill="rgba(255,255,255,0.2)" />
      <circle cx={-3} cy={-5} r={2} fill="rgba(255,255,255,0.35)" />
    </g>
  )
}
function GummyToken({ color }: { color: string }) {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={7} ry={9} fill={color} />
      <ellipse cx={-4} cy={-6} rx={3.5} ry={4} fill={color} />
      <ellipse cx={4} cy={-6} rx={3.5} ry={4} fill={color} />
      <ellipse cx={0} cy={0} rx={4} ry={5} fill="rgba(255,255,255,0.2)" />
      <circle cx={-2} cy={-2} r={1.5} fill="white" opacity={0.6} />
      <circle cx={2} cy={-2} r={1.5} fill="white" opacity={0.6} />
    </g>
  )
}

const TOKEN_SHAPES = [CupcakeToken, PopsicleToken, LollipopToken, GummyToken]

function PlayerToken({
  player,
  index,
  playerCount,
  isCurrentPlayer,
}: {
  player: Player
  index: number
  playerCount: number
  isCurrentPlayer: boolean
}) {
  const sq = player.position >= 0 && player.position < boardMatrix.length
    ? boardMatrix[player.position]
    : null

  const { dx, dy } = TOKEN_OFFSETS[index % 4]
  const targetX = sq ? sq.left + dx : -200
  const targetY = sq ? sq.top + dy : -200

  // useMotionValue + useSpring guarantees smooth spring animation and
  // correct initial position (no flash at SVG origin before first animation tick)
  const motionX = useMotionValue(targetX)
  const motionY = useMotionValue(targetY)
  const springX = useSpring(motionX, { stiffness: 110, damping: 20 })
  const springY = useSpring(motionY, { stiffness: 110, damping: 20 })

  useEffect(() => {
    motionX.set(targetX)
    motionY.set(targetY)
  }, [targetX, targetY, motionX, motionY])

  // Hidden players (inactive slots) are kept off-screen; still call hooks above
  if (index >= playerCount) return null

  const color = PLAYER_COLORS[index]
  const TokenShape = TOKEN_SHAPES[index]

  return (
    <motion.g style={{ x: springX, y: springY }}>
      {/* Idle float animation */}
      <motion.g
        animate={{ y: [0, FLOAT_AMPLITUDE, 0] }}
        transition={{ duration: FLOAT_BASE_DURATION + index * FLOAT_DURATION_INC, repeat: Infinity, ease: 'easeInOut', delay: index * FLOAT_DELAY_INC }}
      >
        {/* Ground shadow */}
        <ellipse rx={TOKEN_RADIUS * 0.75} ry={3} cy={TOKEN_RADIUS + 1} fill="rgba(0,0,0,0.35)" />

        {/* Pulsing ring for current player */}
        {isCurrentPlayer && (
          <motion.circle
            r={TOKEN_RADIUS + 5}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            animate={{ opacity: [0.9, 0.1, 0.9], r: [PULSE_RING_MIN_OFFSET, PULSE_RING_MAX_OFFSET, PULSE_RING_MIN_OFFSET] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        )}

        {/* Token base circle */}
        <circle r={TOKEN_RADIUS + 1} fill={color} opacity={0.85} />
        <circle r={TOKEN_RADIUS + 1} fill="none" stroke="white" strokeWidth={1.5} opacity={0.5} />

        {/* Candy-themed shape */}
        <TokenShape color={color} />

        {/* Player initial */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fill="white"
          fontWeight="bold"
          y={TOKEN_RADIUS + 8}
          style={{ userSelect: 'none' }}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={0.5}
          paintOrder="stroke"
        >
          {player.name.charAt(0).toUpperCase()}
        </text>
      </motion.g>
    </motion.g>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────
export default function Board({ players, playerCount, currentPlayer }: BoardProps) {
  const endSq = boardMatrix[boardMatrix.length - 1]

  return (
    <div className="relative overflow-auto max-w-full">
      <svg
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        style={{
          background: 'linear-gradient(160deg, #0d1b2a 0%, #1a1035 35%, #0e2040 70%, #1a0820 100%)',
          display: 'block',
        }}
        className="rounded-2xl shadow-2xl border-4 border-pink-500"
      >
        {/* ── Background star field ── */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={((i * STAR_X_STRIDE + STAR_X_OFFSET) % BOARD_WIDTH)}
            cy={((i * STAR_Y_STRIDE + STAR_Y_OFFSET) % BOARD_HEIGHT)}
            r={STAR_MIN_RADIUS + (i % 3) * STAR_RADIUS_STEP}
            fill="white"
            opacity={STAR_BASE_OPACITY + (i % 5) * STAR_OPACITY_STEP}
          />
        ))}

        {/* ── Candy-land zone backgrounds ── */}
        {ZONES.map((z, i) => (
          <g key={i}>
            <rect x={z.rx} y={z.ry} width={z.rw} height={z.rh} rx={18} fill={z.color} />
            <text
              x={z.rx + z.rw / 2}
              y={z.ry + 14}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.35)"
              fontStyle="italic"
            >
              {z.label}
            </text>
          </g>
        ))}

        {/* ── Decorative lollipops scattered on board ── */}
        <Lollipop x={48}  y={195} r={16} color="#FF4444" />
        <Lollipop x={710} y={495} r={13} color="#9B59B6" />
        <Lollipop x={375} y={95}  r={15} color="#F1C40F" />
        <Lollipop x={605} y={860} r={16} color="#3498DB" />
        <Lollipop x={130} y={510} r={12} color="#2ECC71" />
        <Lollipop x={490} y={290} r={11} color="#E74C3C" />

        {/* ── Path glow layers ── */}
        <polyline
          points={boardMatrix.map((sq) => `${sq.left},${sq.top}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={30}
          strokeLinejoin="round" strokeLinecap="round"
        />
        <polyline
          points={boardMatrix.map((sq) => `${sq.left},${sq.top}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={20}
          strokeLinejoin="round" strokeLinecap="round"
        />
        {/* Candy-cane dashed accent on path */}
        <polyline
          points={boardMatrix.map((sq) => `${sq.left},${sq.top}`).join(' ')}
          fill="none" stroke="rgba(255,68,68,0.15)" strokeWidth={8}
          strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray="14 10"
        />

        {/* ── Shortcut / licorice slide arrows (drawn BEFORE squares so squares sit on top) ── */}
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
          const size = isEnd ? SQUARE_SIZE + 8 : isSpecial ? SQUARE_SIZE + 4 : SQUARE_SIZE

          return (
            <g key={i} transform={`translate(${sq.left},${sq.top})`}>
              {/* Glow halo for special/jump squares */}
              {(isSpecial || isJumpSource) && (
                <circle r={size * 0.9} fill={color} opacity={isJumpSource ? 0.22 : 0.15} />
              )}

              {/* Square body */}
              <rect
                x={-size / 2} y={-size / 2}
                width={size} height={size}
                rx={isEnd ? size / 2 : isSpecial ? 7 : 5}
                fill={color}
                stroke={isJumpSource ? 'white' : isSpecial ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isJumpSource || isSpecial ? 2 : 1.2}
              />

              {/* Emoji for special squares */}
              {emoji && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={isEnd ? 16 : 13}>
                  {emoji}
                </text>
              )}
              {isEnd && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={16}>🏆</text>
              )}

              {/* Lightning bolt on jump-source squares */}
              {isJumpSource && (
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  y={size / 2 + 8}
                  fill="white"
                  opacity={0.9}
                >
                  ⚡
                </text>
              )}
            </g>
          )
        })}

        {/* ── START / FINISH labels ── */}
        <text x={110} y={968} textAnchor="middle" fontSize="10" fill="#FFD700" fontWeight="bold" opacity={0.9}
          stroke="rgba(0,0,0,0.5)" strokeWidth={0.5} paintOrder="stroke">
          ★ START
        </text>
        <text x={endSq.left} y={endSq.top - 22} textAnchor="middle" fontSize="10" fill="#FFD700" fontWeight="bold" opacity={0.9}
          stroke="rgba(0,0,0,0.5)" strokeWidth={0.5} paintOrder="stroke">
          🏰 FINISH
        </text>

        {/* Sparkles around the finish square */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180
          return (
            <Sparkle
              key={i}
              x={endSq.left + Math.cos(angle) * 28}
              y={endSq.top + Math.sin(angle) * 28}
              size={5 + (i % 2) * 2}
              color={i % 2 === 0 ? '#FFD700' : '#FF69B4'}
              delay={i * 0.4}
            />
          )
        })}

        {/* ── Player tokens (rendered last → always on top) ── */}
        {players.map((player, i) => (
          <PlayerToken
            key={i}
            player={player}
            index={i}
            playerCount={playerCount}
            isCurrentPlayer={i === currentPlayer}
          />
        ))}
      </svg>
    </div>
  )
}
