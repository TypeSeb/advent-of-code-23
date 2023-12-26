import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-9', 'input.txt'), 'utf-8').split('\n')

function analyseNumbers(numbers: number[]): number {
  const diffs: number[] = []

  for (let i = 1; i < numbers.length; i++) {
    const diff = numbers[i] - numbers[i - 1]
    diffs.push(diff)
  }

  if (diffs.every((x) => x === 0)) return numbers.at(-1) ?? 0

  return numbers[numbers.length - 1] + analyseNumbers(diffs)
}

export function first() {
  let length = input.length
  let sum = 0

  while (length--) {
    const numbers = input[length].match(/-?\d+/g)!.map(Number)
    sum += analyseNumbers(numbers)
  }

  console.log(sum)
}
