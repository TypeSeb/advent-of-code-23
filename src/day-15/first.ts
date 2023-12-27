import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-15', 'input.txt'), 'utf-8').split(',')

function hash(str: string): number {
  let hashResult = 0

  for (const char of str) {
    hashResult += char.charCodeAt(0)
    hashResult *= 17
    hashResult %= 256
  }

  return hashResult
}

export function first() {
  console.log(
    input.reduce((prev, curr) => {
      return prev + hash(curr)
    }, 0)
  )
}
