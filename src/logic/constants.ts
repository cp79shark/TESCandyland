export type SquareType =
  | 'red'
  | 'green'
  | 'purple'
  | 'yellow'
  | 'blue'
  | 'orange'
  | 'cupcake'
  | 'lollipop'
  | 'icecream'
  | 'gummy'
  | 'cookie'
  | 'popsicle'
  | 'chocolate'
  | 'end'

export type CardType =
  | 'double-red'
  | 'double-green'
  | 'double-purple'
  | 'double-yellow'
  | 'double-blue'
  | 'double-orange'

export interface Square {
  type: SquareType
  jumpTo?: number
  left: number
  top: number
}

export type Card = {
  type: SquareType | CardType
} | null

export interface Player {
  name: string
  position: number
  selectedCard: Card
}

export const BOARD_WIDTH = 760
export const BOARD_HEIGHT = 980

export const SQUARE_COLORS: Record<string, string> = {
  red: '#FF4444',
  purple: '#9B59B6',
  yellow: '#F1C40F',
  blue: '#3498DB',
  orange: '#E67E22',
  green: '#2ECC71',
  cupcake: '#FF69B4',
  lollipop: '#FF1493',
  icecream: '#87CEEB',
  gummy: '#7CFC00',
  cookie: '#D2691E',
  popsicle: '#00CED1',
  chocolate: '#8B4513',
  end: '#FFD700',
}

export const SQUARE_EMOJIS: Record<string, string> = {
  cupcake: '🧁',
  lollipop: '🍭',
  icecream: '🍦',
  gummy: '🍬',
  cookie: '🍪',
  popsicle: '🍧',
  chocolate: '🍫',
}

export const PLAYER_COLORS = ['#2ECC71', '#3498DB', '#9B59B6', '#E74C3C']
export const PLAYER_NAMES_DEFAULT = ['Player 1', 'Player 2', 'Player 3', 'Player 4']

export const boardMatrix: Array<Square> = [
  { type: 'red', top: 945, left: 110 },
  { type: 'purple', top: 952, left: 146 },
  { type: 'yellow', top: 940, left: 185 },
  { type: 'blue', jumpTo: 59, top: 903, left: 208 },
  { type: 'orange', top: 864, left: 211 },
  { type: 'green', top: 836, left: 232 },
  { type: 'red', top: 818, left: 258 },
  { type: 'purple', top: 809, left: 302 },
  { type: 'cupcake', top: 817, left: 343 },
  { type: 'yellow', top: 842, left: 376 },
  { type: 'blue', top: 876, left: 402 },
  { type: 'orange', top: 908, left: 428 },
  { type: 'green', top: 935, left: 458 },
  { type: 'red', top: 948, left: 495 },
  { type: 'purple', top: 956, left: 525 },
  { type: 'yellow', top: 936, left: 545 },
  { type: 'blue', top: 900, left: 556 },
  { type: 'orange', top: 872, left: 544 },
  { type: 'green', top: 850, left: 511 },
  { type: 'icecream', top: 813, left: 486 },
  { type: 'red', top: 792, left: 447 },
  { type: 'purple', top: 780, left: 404 },
  { type: 'yellow', top: 757, left: 365 },
  { type: 'blue', top: 718, left: 359 },
  { type: 'orange', top: 685, left: 379 },
  { type: 'green', top: 677, left: 415 },
  { type: 'red', top: 681, left: 461 },
  { type: 'purple', top: 705, left: 497 },
  { type: 'yellow', jumpTo: 40, top: 732, left: 522 },
  { type: 'blue', top: 763, left: 550 },
  { type: 'orange', top: 788, left: 581 },
  { type: 'green', top: 801, left: 615 },
  { type: 'red', top: 803, left: 652 },
  { type: 'purple', top: 791, left: 689 },
  { type: 'yellow', top: 752, left: 716 },
  { type: 'blue', top: 711, left: 724 },
  { type: 'orange', top: 672, left: 718 },
  { type: 'green', top: 635, left: 702 },
  { type: 'red', top: 614, left: 666 },
  { type: 'purple', top: 591, left: 628 },
  { type: 'yellow', top: 581, left: 586 },
  { type: 'gummy', top: 580, left: 544 },
  { type: 'blue', top: 579, left: 502 },
  { type: 'orange', top: 579, left: 458 },
  { type: 'green', jumpTo: 0, top: 595, left: 415 },
  { type: 'red', top: 609, left: 375 },
  { type: 'purple', top: 630, left: 352 },
  { type: 'yellow', top: 662, left: 326 },
  { type: 'blue', top: 694, left: 302 },
  { type: 'orange', top: 724, left: 271 },
  { type: 'green', top: 753, left: 242 },
  { type: 'red', top: 776, left: 212 },
  { type: 'purple', top: 796, left: 179 },
  { type: 'yellow', top: 808, left: 145 },
  { type: 'blue', top: 811, left: 105 },
  { type: 'orange', top: 797, left: 67 },
  { type: 'green', top: 771, left: 26 },
  { type: 'red', top: 728, left: 27 },
  { type: 'purple', top: 690, left: 41 },
  { type: 'yellow', top: 662, left: 66 },
  { type: 'blue', top: 651, left: 113 },
  { type: 'orange', top: 651, left: 156 },
  { type: 'green', top: 663, left: 198 },
  { type: 'red', top: 665, left: 234 },
  { type: 'purple', top: 653, left: 268 },
  { type: 'yellow', top: 626, left: 294 },
  { type: 'blue', top: 590, left: 305 },
  { type: 'orange', top: 549, left: 290 },
  { type: 'cookie', top: 541, left: 251 },
  { type: 'green', top: 533, left: 210 },
  { type: 'red', top: 527, left: 170 },
  { type: 'purple', top: 490, left: 144 },
  { type: 'yellow', top: 453, left: 142 },
  { type: 'blue', top: 415, left: 162 },
  { type: 'orange', top: 387, left: 192 },
  { type: 'green', jumpTo: 0, top: 370, left: 222 },
  { type: 'red', top: 354, left: 266 },
  { type: 'purple', top: 351, left: 306 },
  { type: 'yellow', top: 353, left: 350 },
  { type: 'blue', top: 371, left: 390 },
  { type: 'orange', top: 408, left: 407 },
  { type: 'green', top: 445, left: 406 },
  { type: 'red', top: 481, left: 400 },
  { type: 'purple', top: 517, left: 418 },
  { type: 'yellow', top: 527, left: 461 },
  { type: 'blue', top: 534, left: 499 },
  { type: 'orange', top: 540, left: 538 },
  { type: 'green', top: 541, left: 574 },
  { type: 'red', top: 538, left: 611 },
  { type: 'purple', top: 530, left: 648 },
  { type: 'yellow', top: 513, left: 681 },
  { type: 'lollipop', top: 479, left: 711 },
  { type: 'blue', top: 442, left: 719 },
  { type: 'orange', top: 418, left: 685 },
  { type: 'green', top: 416, left: 642 },
  { type: 'red', top: 404, left: 601 },
  { type: 'purple', top: 385, left: 566 },
  { type: 'yellow', top: 352, left: 573 },
  { type: 'blue', top: 322, left: 598 },
  { type: 'orange', top: 292, left: 609 },
  { type: 'green', top: 254, left: 604 },
  { type: 'popsicle', top: 215, left: 627 },
  { type: 'red', top: 181, left: 623 },
  { type: 'purple', top: 175, left: 573 },
  { type: 'yellow', top: 186, left: 527 },
  { type: 'blue', top: 210, left: 499 },
  { type: 'orange', top: 239, left: 471 },
  { type: 'green', top: 268, left: 436 },
  { type: 'red', top: 290, left: 402 },
  { type: 'purple', top: 301, left: 361 },
  { type: 'yellow', top: 311, left: 318 },
  { type: 'blue', top: 310, left: 269 },
  { type: 'orange', top: 320, left: 230 },
  { type: 'green', top: 337, left: 193 },
  { type: 'red', top: 358, left: 160 },
  { type: 'purple', top: 371, left: 125 },
  { type: 'chocolate', top: 361, left: 84 },
  { type: 'blue', top: 332, left: 48 },
  { type: 'orange', top: 300, left: 34 },
  { type: 'green', top: 257, left: 32 },
  { type: 'red', top: 219, left: 40 },
  { type: 'purple', top: 185, left: 54 },
  { type: 'yellow', top: 161, left: 68 },
  { type: 'blue', top: 140, left: 93 },
  { type: 'orange', top: 132, left: 136 },
  { type: 'green', top: 136, left: 174 },
  { type: 'red', top: 172, left: 187 },
  { type: 'purple', top: 204, left: 194 },
  { type: 'yellow', top: 239, left: 201 },
  { type: 'blue', top: 260, left: 232 },
  { type: 'orange', top: 269, left: 277 },
  { type: 'green', top: 254, left: 310 },
  { type: 'end', top: 184, left: 356 },
]

export function createDeck(): Card[] {
  const gameCards: Card[] = []
  const colors: SquareType[] = ['red', 'purple', 'yellow', 'blue', 'orange', 'green']

  colors.forEach((color) => {
    for (let i = 0; i < 6; i++) {
      gameCards.push({ type: color })
    }
  })

  const doubles: CardType[] = [
    'double-red',
    'double-purple',
    'double-yellow',
    'double-blue',
    'double-orange',
    'double-green',
  ]
  doubles.forEach((d) => {
    for (let i = 0; i < 4; i++) {
      gameCards.push({ type: d })
    }
  })

  const specials: SquareType[] = ['cupcake', 'lollipop', 'icecream', 'gummy', 'cookie', 'popsicle', 'chocolate']
  specials.forEach((s) => gameCards.push({ type: s }))

  return gameCards
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
