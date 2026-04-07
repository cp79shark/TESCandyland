import { motion } from 'framer-motion'
import { boardMatrix, BOARD_HEIGHT, BOARD_WIDTH, SQUARE_COLORS, SQUARE_EMOJIS, Player, PLAYER_COLORS } from '../../logic/constants'

interface BoardProps {
  players: Player[]
  playerCount: number
  currentPlayer: number
}

const SQUARE_SIZE = 18
const TOKEN_RADIUS = 9

function GingerbreadToken({ color }: { color: string }) {
  return (
    <g>
      <circle r={4} cy={-8} fill={color} />
      <rect x={-3} y={-4} width={6} height={8} rx={1} fill={color} />
      <line x1={-5} y1={-1} x2={-3} y2={-1} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1={3} y1={-1} x2={5} y2={-1} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1={-2} y1={4} x2={-3.5} y2={8} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1={2} y1={4} x2={3.5} y2={8} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function StarToken({ color }: { color: string }) {
  const points = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const innerAngle = outerAngle + (2 * Math.PI) / 10
    const outer = `${(7 * Math.cos(outerAngle)).toFixed(2)},${(7 * Math.sin(outerAngle)).toFixed(2)}`
    const inner = `${(3.5 * Math.cos(innerAngle)).toFixed(2)},${(3.5 * Math.sin(innerAngle)).toFixed(2)}`
    return `${outer} ${inner}`
  }).join(' ')
  return <polygon points={points} fill={color} />
}

function DiamondToken({ color }: { color: string }) {
  return <polygon points="0,-8 7,0 0,8 -7,0" fill={color} />
}

function HeartToken({ color }: { color: string }) {
  return (
    <path
      d="M0,4 C0,4 -7,-2 -7,-5 C-7,-9 -3.5,-10 0,-7 C3.5,-10 7,-9 7,-5 C7,-2 0,4 0,4 Z"
      fill={color}
    />
  )
}

const TOKEN_SHAPES = [GingerbreadToken, StarToken, DiamondToken, HeartToken]

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
  if (index >= playerCount) return null
  const sq =
    player.position >= 0 && player.position < boardMatrix.length ? boardMatrix[player.position] : null

  const offsetX = (index % 2) * 16 - 8
  const offsetY = index < 2 ? -8 : 8

  const x = sq ? sq.left + offsetX : -100
  const y = sq ? sq.top + offsetY : -100

  const color = PLAYER_COLORS[index]
  const TokenShape = TOKEN_SHAPES[index]

  return (
    <motion.g
      key={`player-${index}`}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
      style={{ filter: `drop-shadow(0 0 ${isCurrentPlayer ? 6 : 3}px ${color})` }}
    >
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
      >
        {isCurrentPlayer && (
          <motion.circle
            r={TOKEN_RADIUS + 4}
            fill="none"
            stroke={color}
            strokeWidth={2}
            animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <circle r={TOKEN_RADIUS} fill={color} opacity={0.2} />
        <TokenShape color={color} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="6"
          fill="white"
          fontWeight="bold"
          y={12}
          style={{ userSelect: 'none' }}
        >
          {player.name.charAt(0)}
        </text>
      </motion.g>
    </motion.g>
  )
}

export default function Board({ players, playerCount, currentPlayer }: BoardProps) {
  return (
    <div className="relative overflow-auto">
      <svg
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'block',
        }}
        className="rounded-2xl shadow-2xl border-4 border-pink-500"
      >
        {/* Decorative background circles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.sin((i * 45 * Math.PI) / 180) * 300 + BOARD_WIDTH / 2}
            cy={Math.cos((i * 45 * Math.PI) / 180) * 400 + BOARD_HEIGHT / 2}
            r={40 + i * 15}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="2"
          />
        ))}

        {/* Board path */}
        <polyline
          points={boardMatrix.map((sq) => `${sq.left},${sq.top}`).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Squares */}
        {boardMatrix.map((sq, i) => {
          const color = SQUARE_COLORS[sq.type] ?? '#888'
          const emoji = SQUARE_EMOJIS[sq.type]
          const isEnd = sq.type === 'end'
          return (
            <g key={i} transform={`translate(${sq.left},${sq.top})`}>
              <rect
                x={-SQUARE_SIZE / 2}
                y={-SQUARE_SIZE / 2}
                width={SQUARE_SIZE}
                height={SQUARE_SIZE}
                rx={isEnd ? SQUARE_SIZE / 2 : 4}
                fill={color}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
              {emoji ? (
                <text textAnchor="middle" dominantBaseline="central" fontSize="11">
                  {emoji}
                </text>
              ) : null}
              {isEnd ? (
                <text textAnchor="middle" dominantBaseline="central" fontSize="9">
                  🏆
                </text>
              ) : null}
              {sq.jumpTo !== undefined ? (
                <circle r={3} fill="white" opacity={0.7} cx={-SQUARE_SIZE / 2 + 3} cy={-SQUARE_SIZE / 2 + 3} />
              ) : null}
            </g>
          )
        })}

        {/* Player tokens */}
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
