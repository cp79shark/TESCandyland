import { describe, it, expect } from 'vitest'
import { computeMove } from './logic/gameEngine'
import { createDeck, shuffle, boardMatrix } from './logic/constants'

describe('gameEngine', () => {
  it('computeMove finds the correct color square', () => {
    const player = { name: 'Test', position: 0, selectedCard: null }
    const result = computeMove(player, { type: 'red' })
    expect(boardMatrix[result.newPosition].type).toBe('red')
  })

  it('computeMove detects a win at end square', () => {
    const player = { name: 'Test', position: boardMatrix.length - 2, selectedCard: null }
    const result = computeMove(player, { type: 'end' })
    expect(result.isWin).toBe(true)
  })

  it('createDeck contains expected cards', () => {
    const deck = createDeck()
    expect(deck.length).toBeGreaterThan(50)
    const specials = deck.filter((c) => c?.type === 'cupcake')
    expect(specials.length).toBe(1)
  })

  it('shuffle returns same length', () => {
    const deck = createDeck()
    const shuffled = shuffle(deck)
    expect(shuffled.length).toBe(deck.length)
  })
})
