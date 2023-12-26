import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-7', 'input.txt'), 'utf-8').split('\n')

const cardRanking = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

enum HandType {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND
}

type Hand = {
  hand: string
  type: HandType
  bid: number
}

function getHandType(hand: string): HandType {
  const tmp: Record<string, number> = {}
  let handType = HandType.HIGH_CARD

  for (const card of hand) {
    if (tmp[card] === undefined) tmp[card] = 1
    else tmp[card] = tmp[card] + 1
  }

  for (const count of Object.values(tmp)) {
    if (count === 2) {
      if (handType === HandType.HIGH_CARD) handType = HandType.ONE_PAIR
      else if (handType === HandType.ONE_PAIR) handType = HandType.TWO_PAIR
      else if (handType === HandType.THREE_OF_A_KIND) handType = HandType.FULL_HOUSE
    }

    if (count === 3) {
      if (handType === HandType.ONE_PAIR) handType = HandType.FULL_HOUSE
      else handType = HandType.THREE_OF_A_KIND
    }

    if (count === 4) handType = HandType.FOUR_OF_A_KIND

    if (count === 5) handType = HandType.FIVE_OF_A_KIND
  }

  return handType
}

export function first() {
  const hands: Hand[] = []

  input.forEach((handInput) => {
    const hand = handInput.split(' ')[0]
    const bid = +handInput.split(' ')[1]

    const type = getHandType(hand)

    hands.push({ hand, bid, type })
  })

  hands.sort((lhs, rhs) => {
    if (lhs.type > rhs.type) return 1

    if (lhs.type < rhs.type) return -1

    for (let i = 0; i < lhs.hand.length; i++) {
      const lhsCardRanking = cardRanking.findIndex((x) => x === lhs.hand[i])
      const rhsCardRanking = cardRanking.findIndex((x) => x === rhs.hand[i])

      if (lhsCardRanking > rhsCardRanking) return 1
      if (lhsCardRanking < rhsCardRanking) return -1
    }

    return 0
  })

  console.log(
    hands.reduce((prev, curr, idx) => {
      prev += curr.bid * (idx + 1)
      return prev
    }, 0)
  )
}
