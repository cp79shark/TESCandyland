import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/UI/Button'
import { PLAYER_COLORS, PLAYER_NAMES_DEFAULT } from '../../logic/constants'

interface NewGameProps {
  players: { name: string }[]
  playerCount: number
  setPlayerNames: (names: string[], count: number) => void
  resetGame: (names?: string[]) => void
}

export default function NewGame({ players, playerCount, setPlayerNames, resetGame }: NewGameProps) {
  const navigate = useNavigate()
  const [names, setNames] = useState<string[]>(players.map((p) => p.name))
  const [count, setCount] = useState(playerCount)

  function handleStart() {
    const finalNames = [...names]
    while (finalNames.length < 4) finalNames.push(PLAYER_NAMES_DEFAULT[finalNames.length])
    setPlayerNames(finalNames, count)
    resetGame(finalNames)
    navigate('/game')
  }

  function updateName(i: number, value: string) {
    const next = [...names]
    next[i] = value
    setNames(next)
  }

  const playerLabels = ['Player 1', 'Player 2', 'Player 3', 'Player 4']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 p-8 max-w-md mx-auto"
    >
      <h2 className="text-3xl font-candy font-bold text-pink-300">🎮 New Game</h2>

      <div className="w-full flex flex-col gap-2">
        <label className="text-white font-bold">Number of Players</label>
        <select
          className="bg-gray-800 text-white border border-pink-400 rounded-lg px-4 py-2 font-candy"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      {playerLabels.map((label, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="w-full flex flex-col gap-1"
          style={{ opacity: i >= count ? 0.4 : 1 }}
        >
          <label className="font-bold text-sm" style={{ color: PLAYER_COLORS[i] }}>
            {label}:
          </label>
          <input
            type="text"
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 font-candy focus:outline-none focus:border-pink-400"
            value={names[i] ?? PLAYER_NAMES_DEFAULT[i]}
            disabled={i >= count}
            onChange={(e) => updateName(i, e.target.value)}
            style={{ borderColor: i < count ? PLAYER_COLORS[i] : undefined }}
          />
        </motion.div>
      ))}

      <Button onClick={handleStart} variant="primary" className="w-full text-xl mt-4">
        🍬 Start Game!
      </Button>
    </motion.div>
  )
}
