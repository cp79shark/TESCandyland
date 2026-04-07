import { boardMatrix, Card, CardType, Player, Square, SquareType } from './constants'

export function isColorType(type: string): boolean {
  return ['red', 'purple', 'yellow', 'blue', 'orange', 'green'].includes(type)
}

export function hasJumpTo(square: Square): boolean {
  if (!square) return false
  return square.jumpTo !== undefined && square.jumpTo >= 0
}

export function getSearchStartPosition(type: string, fallbackPosition: number): number {
  const knownPositions: Record<string, number> = {
    lollipop: 90,
    cookie: 67,
    cupcake: 7,
    icecream: 18,
    gummy: 40,
    popsicle: 99,
    chocolate: 114,
  }
  if (knownPositions[type] !== undefined) return knownPositions[type]
  return fallbackPosition >= 0 ? fallbackPosition : 0
}

export interface MoveResult {
  newPosition: number
  landedSquare: Square
  jumpedTo: number | null
  isWin: boolean
}

export function computeMove(player: Player, card: NonNullable<Card>): MoveResult {
  let position = player.position + 1
  const isDouble = card.type.startsWith('double')
  const cardColor = isDouble ? (card.type as CardType).split('double-')[1] : (card.type as SquareType)
  let numberOfMoves = isDouble ? 2 : 1

  let startSearchPosition = getSearchStartPosition(card.type, position)
  let landedSquare: Square = boardMatrix[boardMatrix.length - 1]

  while (numberOfMoves > 0) {
    for (let i = startSearchPosition; i < boardMatrix.length; i++) {
      const sq = boardMatrix[i]
      if (sq.type === cardColor || sq.type === 'end') {
        position = i
        startSearchPosition = position + 1
        landedSquare = sq
        break
      }
    }
    numberOfMoves--
  }

  const isWin = position >= boardMatrix.length - 1
  const jumpedTo = !isWin && hasJumpTo(landedSquare) ? landedSquare.jumpTo! : null

  return {
    newPosition: jumpedTo !== null ? jumpedTo : position,
    landedSquare,
    jumpedTo,
    isWin,
  }
}
