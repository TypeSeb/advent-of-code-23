import { input } from './input'

function analyseNumbers(numbers: number[]): number {
  const diffs: number[] = []

  for (let i = 1; i < numbers.length; i++) {
    const diff = numbers[i] - numbers[i - 1]
    diffs.push(diff)
  }

  if (diffs.every((x) => x === 0)) return numbers.at(-1) ?? 0

  return numbers[0] - analyseNumbers(diffs)
}

export function second() {
  let length = input.length
  let sum = 0

  while (length--) {
    const numbers = input[length].match(/-?\d+/g)!.map(Number)

    sum += analyseNumbers(numbers)
  }

  console.log(sum)
}
