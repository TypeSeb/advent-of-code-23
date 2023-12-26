import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-7', 'input.txt'), 'utf-8').split('\n')

const cardRanking = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']

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

function getBestHand(hand: string): HandType {
  const tmpHand: Record<string, number> = {}
  let handType = HandType.HIGH_CARD

  for (const card of hand) {
    if (tmpHand[card] === undefined) tmpHand[card] = 1
    else tmpHand[card] = tmpHand[card] + 1
  }

  const jokers = tmpHand['J']
  delete tmpHand['J']

  for (const count of Object.values(tmpHand)) {
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

  if (jokers < 5) {
    let maxKey: { key: string; cnt: number } = { key: 'J', cnt: 0 }

    for (const card in tmpHand) {
      if (tmpHand[card] > maxKey.cnt) maxKey = { key: card, cnt: tmpHand[card] }
      if (
        tmpHand[card] === maxKey.cnt &&
        cardRanking.findIndex((x) => x === card) > cardRanking.findIndex((x) => x === maxKey.key)
      )
        maxKey = { key: card, cnt: tmpHand[card] }
    }

    const bestHand = hand.replace(new RegExp('J', 'g'), maxKey.key)
    return getBestHand(bestHand)
  } else if (jokers === 5) return HandType.FIVE_OF_A_KIND

  return handType
}

export function second() {
  const hands: Hand[] = []

  input.forEach((handInput) => {
    const hand = handInput.split(' ')[0]
    const bid = +handInput.split(' ')[1]

    const type = getBestHand(hand)

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
