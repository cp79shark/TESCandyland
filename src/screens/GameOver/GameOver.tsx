import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/UI/Button'
import CandyParticles from '../../components/UI/CandyParticles'

interface GameOverProps {
  winner: string | null
  setGameOver: (over: boolean) => void
}

export default function GameOver({ winner, setGameOver }: GameOverProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!winner) {
      navigate('/')
    }
    setGameOver(false)
  }, [winner, navigate, setGameOver])

  if (!winner) return null

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] gap-8 p-8 text-center">
      <CandyParticles count={25} />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        className="text-8xl"
      >
        🏆
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-candy font-bold text-yellow-300"
      >
        Game Over!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-3xl font-candy"
      >
        🍬🍬 Congratulations, <span className="text-pink-300 font-bold">{winner}</span>! 🍭🍭
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4"
      >
        <Button onClick={() => navigate('/')} variant="secondary">
          🎮 New Game
        </Button>
      </motion.div>
    </div>
  )
}
