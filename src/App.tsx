import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameState } from './hooks/useGameState'
import NewGame from './screens/NewGame/NewGame'
import Game from './screens/Game/Game'
import GameOver from './screens/GameOver/GameOver'
import CandyParticles from './components/UI/CandyParticles'
import CandyMusic from './components/UI/CandyMusic'

export default function App() {
  const game = useGameState()

  return (
    <Router basename="/TESCandyland">
      <div className="relative min-h-screen bg-gray-900 text-white">
        <CandyParticles count={12} />
        <CandyMusic />

        <header className="relative z-10 text-center py-6 px-4">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-candy font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FF4444, #FF69B4, #9B59B6, #3498DB)',
            }}
          >
            🍬🍬 TES Candyland!! 🍭🍭
          </motion.h1>
          <p className="text-xs text-gray-400 mt-1">
            <a
              href="https://shop.hasbro.com/en-us/product/candy-land-game:C4E461C2-5056-9047-F5F7-F005920A3999"
              className="underline hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Candyland
            </a>{' '}
            is published by Hasbro. This is an educational parody/tool.
          </p>
        </header>

        <main className="relative z-10 container mx-auto px-4 pb-8">
          <Routes>
            <Route
              path="/"
              element={
                <NewGame
                  players={game.players}
                  playerCount={game.playerCount}
                  setPlayerNames={game.setPlayerNames}
                  resetGame={game.resetGame}
                />
              }
            />
            <Route
              path="/game"
              element={
                <Game
                  players={game.players}
                  playerCount={game.playerCount}
                  currentPlayer={game.currentPlayer}
                  winner={game.winner}
                  gameOver={game.gameOver}
                  drawCard={game.drawCard}
                />
              }
            />
            <Route
              path="/gameover"
              element={<GameOver winner={game.winner} setGameOver={game.setGameOver} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
