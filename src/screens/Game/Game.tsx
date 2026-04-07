import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Board from '../../components/Board/Board'
import DrawnCard from '../../components/Card/Card'
import Button from '../../components/UI/Button'
import { Player, PLAYER_COLORS } from '../../logic/constants'

interface GameProps {
  players: Player[]
  playerCount: number
  currentPlayer: number
  winner: string | null
  gameOver: boolean
  drawCard: () => void
}

export default function Game({ players, playerCount, currentPlayer, winner, gameOver, drawCard }: GameProps) {
  const navigate = useNavigate()
  const [playerMoving, setPlayerMoving] = useState(false)

  useEffect(() => {
    if (gameOver) {
      navigate('/gameover')
    }
  }, [gameOver, navigate])

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start justify-center p-4 w-full">
      {/* Board */}
      <div className="flex-shrink-0">
        <Board
          players={players}
          playerCount={playerCount}
          currentPlayer={currentPlayer}
          onAnimatingChange={setPlayerMoving}
        />
      </div>

      {/* Side panel */}
      <div className="flex flex-col gap-4 min-w-[220px] w-full xl:w-auto">
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-400 text-black rounded-2xl p-4 text-center font-bold text-lg shadow-lg"
            >
              🏆 {winner} wins! 🏆
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={drawCard}
          disabled={!!winner || playerMoving}
          variant="primary"
          className="w-full"
        >
          {playerMoving ? '🚶 Moving…' : '🎴 Draw Card'}
        </Button>

        <div className="flex flex-col gap-3">
          {players.slice(0, playerCount).map((player, i) => {
            const isActive = i === currentPlayer
            return (
              <motion.div
                key={i}
                animate={{ scale: isActive ? 1.03 : 1 }}
                className={`rounded-xl p-3 border-2 ${
                  isActive ? 'bg-gray-700' : 'bg-gray-800'
                }`}
                style={{ borderColor: PLAYER_COLORS[i] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isActive && <span>👉</span>}
                  <h3 className="font-bold text-sm" style={{ color: PLAYER_COLORS[i] }}>
                    {player.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Square {player.position + 1}
                  </span>
                </div>
                <DrawnCard card={player.selectedCard} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
