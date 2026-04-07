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
const SQUARE_SIZE = 24
const TOKEN_RADIUS = 10
/** Horizontal gap between tokens that share the same square */
const MULTI_SPACING = TOKEN_RADIUS * 2.2

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
const FLOAT_AMPLITUDE = -7

// Pulse ring animation for active player
const PULSE_RING_MIN = TOKEN_RADIUS + 3
const PULSE_RING_MAX = TOKEN_RADIUS + 9

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

// ─── Candy token shapes ───────────────────────────────────────────────────────
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
  const sq = player.position >= 0 && player.position < boardMatrix.length
    ? boardMatrix[player.position]
    : null

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
          <ellipse rx={TOKEN_RADIUS * 0.75} ry={3} cy={TOKEN_RADIUS + 1} fill="rgba(0,0,0,0.35)" />

          {/* Pulsing ring for active player */}
          {isCurrentPlayer && (
            <motion.circle
              r={TOKEN_RADIUS + 5}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              animate={{ opacity: [0.9, 0.1, 0.9], r: [PULSE_RING_MIN, PULSE_RING_MAX, PULSE_RING_MIN] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          )}

          {/* Token body */}
          <circle r={TOKEN_RADIUS + 1} fill={color} opacity={0.85} />
          <circle r={TOKEN_RADIUS + 1} fill="none" stroke="white" strokeWidth={1.5} opacity={0.5} />
          <TokenShape color={color} />

          {/* Player initial */}
          <text
            textAnchor="middle" dominantBaseline="central"
            fontSize="7" fill="white" fontWeight="bold"
            y={TOKEN_RADIUS + 8}
            style={{ userSelect: 'none' }}
            stroke="rgba(0,0,0,0.4)" strokeWidth={0.5} paintOrder="stroke"
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

  // Build position→[playerIndexes] map so tokens on the same square spread horizontally
  const squareGroups = new Map<number, number[]>()
  for (let i = 0; i < playerCount; i++) {
    const pos = players[i].position
    if (pos < 0) continue
    squareGroups.set(pos, [...(squareGroups.get(pos) ?? []), i])
  }

  function getOffset(playerIndex: number): { dx: number; dy: number } {
    const pos = players[playerIndex].position
    if (pos < 0) return { dx: 0, dy: 0 }
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
        style={{
          background: 'linear-gradient(160deg, #0d1b2a 0%, #1a1035 35%, #0e2040 70%, #1a0820 100%)',
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

        {/* ── Path glow ── */}
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={30}
          strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,255,255,0.10)" strokeWidth={20}
          strokeLinejoin="round" strokeLinecap="round" />
        {/* Candy-cane dashed accent */}
        <polyline points={pathPoints} fill="none"
          stroke="rgba(255,68,68,0.15)" strokeWidth={8}
          strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray="14 10" />

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
          const size = isEnd ? SQUARE_SIZE + 8 : isSpecial ? SQUARE_SIZE + 4 : SQUARE_SIZE
          return (
            <g key={i} transform={`translate(${sq.left},${sq.top})`}>
              {(isSpecial || isJumpSource) && (
                <circle r={size * 0.9} fill={color} opacity={isJumpSource ? 0.22 : 0.15} />
              )}
              <rect
                x={-size / 2} y={-size / 2} width={size} height={size}
                rx={isEnd ? size / 2 : isSpecial ? 7 : 5}
                fill={color}
                stroke={isJumpSource ? 'white' : isSpecial ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isJumpSource || isSpecial ? 2 : 1.2}
              />
              {emoji && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={isEnd ? 16 : 13}>{emoji}</text>
              )}
              {isEnd && (
                <text textAnchor="middle" dominantBaseline="central" fontSize={16}>🏆</text>
              )}
              {isJumpSource && (
                <text textAnchor="middle" dominantBaseline="central" fontSize="9"
                  y={size / 2 + 8} fill="white" opacity={0.9}>⚡</text>
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
