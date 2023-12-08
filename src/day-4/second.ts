import { input } from './input'

type Line = { cardNumber: number; winningNumbers: Map<number, number>; userNumbers: number[] }

const copyCards: number[] = new Array(input.length + 1).fill(0) // +1 to ignore zero based array index

function parseLine(line: string): Line {
  const split = line.split(':')
  const cardNumber = +split[0].substring('Card '.length - 1)
  const winningNumbers = split[1]
    .split('|')[0]
    .split(' ')
    .filter((x) => x.length)
    .map((x) => +x)
  const userNumbers = split[1]
    .split('|')[1]
    .split(' ')
    .filter((x) => x.length)
    .map((x) => +x)

  const winningNumbersMap: Map<number, number> = new Map()
  winningNumbers.forEach((winningNumber) => winningNumbersMap.set(winningNumber, winningNumber))

  return { cardNumber, winningNumbers: winningNumbersMap, userNumbers }
}

export function second() {
  input.forEach((line) => {
    const lineResult = parseLine(line)
    const userWinningNumbers = lineResult.userNumbers
      .map((userNumber) => lineResult.winningNumbers.get(userNumber))
      .filter((x) => x !== undefined)

    const currentCard = lineResult.cardNumber
    const addingCopyCards = userWinningNumbers.map((_val, index) => currentCard + index + 1)

    const currentCardAndCopiesCount = copyCards[currentCard] + 1

    addingCopyCards.forEach((addingCopyCard) => {
      if (addingCopyCard < copyCards.length) {
        copyCards[addingCopyCard] += currentCardAndCopiesCount
      }
    })
  })

  let sum = 0

  // Count copy cards and add afterwards original cards counter
  copyCards.forEach((x) => (sum = sum + x))
  sum += input.length

  console.log(sum) // 13261850
}
