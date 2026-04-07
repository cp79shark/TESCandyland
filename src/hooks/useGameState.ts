import { useCallback, useState } from 'react'
import { Card, createDeck, Player, PLAYER_NAMES_DEFAULT, shuffle, boardMatrix } from '../logic/constants'
import { computeMove } from '../logic/gameEngine'

function makePlayers(names: string[] = PLAYER_NAMES_DEFAULT): Player[] {
  return names.map((name) => ({ name, position: -1, selectedCard: null }))
}

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>(makePlayers())
  const [playerCount, setPlayerCount] = useState(4)
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [deck, setDeck] = useState<Card[]>(() => shuffle(createDeck()))
  const [winner, setWinner] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [lastCard, setLastCard] = useState<Card>(null)
  const [lastJump, setLastJump] = useState<{ from: number; to: number } | null>(null)

  const resetGame = useCallback(
    (names?: string[]) => {
      const playerNames = names ?? players.map((p) => p.name)
      setPlayers(makePlayers(playerNames))
      setCurrentPlayer(0)
      setWinner(null)
      setGameOver(false)
      setLastCard(null)
      setLastJump(null)
      setDeck(shuffle(createDeck()))
    },
    [players],
  )

  const setPlayerNames = useCallback((names: string[], count: number) => {
    setPlayers(makePlayers(names))
    setPlayerCount(count)
    setWinner(null)
    setGameOver(false)
  }, [])

  const drawCard = useCallback(() => {
    if (gameOver || winner) return

    const randomIndex = Math.floor(Math.random() * deck.length)
    const card = deck[randomIndex]!
    const newDeck = deck.length === 1 ? shuffle(createDeck()) : deck.filter((_, i) => i !== randomIndex)

    const result = computeMove(players[currentPlayer], card)

    setLastCard(card)
    setLastJump(result.jumpedTo !== null ? { from: boardMatrix.indexOf(result.landedSquare), to: result.jumpedTo } : null)

    setPlayers((prev) => {
      const next = prev.map((p, i) =>
        i === currentPlayer
          ? { ...p, position: result.newPosition, selectedCard: card }
          : p,
      )
      return next
    })

    setDeck(newDeck)

    if (result.isWin) {
      setWinner(players[currentPlayer].name)
      setTimeout(() => setGameOver(true), 3500)
      return
    }

    setCurrentPlayer((prev) => (prev + 1) % playerCount)
  }, [deck, players, currentPlayer, playerCount, gameOver, winner])

  return {
    players,
    playerCount,
    setPlayerCount,
    currentPlayer,
    winner,
    gameOver,
    setGameOver,
    lastCard,
    lastJump,
    drawCard,
    resetGame,
    setPlayerNames,
  }
}
