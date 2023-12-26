import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-4', 'input.txt'), 'utf-8').split('\n')

type Line = { cardNumber: number; winningNumbers: Map<number, number>; userNumbers: number[] }

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

export function first() {
  let sum = 0

  input.forEach((line) => {
    const lineResult = parseLine(line)
    const userWinningNumbers = lineResult.userNumbers
      .map((userNumber) => lineResult.winningNumbers.get(userNumber))
      .filter((x) => x !== undefined)

    if (userWinningNumbers.length) sum += 2 ** (userWinningNumbers.length - 1)
  })

  console.log(sum)
}
