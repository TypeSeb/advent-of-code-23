import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-14', 'input.txt'), 'utf-8').split('\n')

export function first() {
  console.log(input)
}
