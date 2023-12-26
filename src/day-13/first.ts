import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-13', 'input.txt'), 'utf-8').split('\n')

function possibleMirror(puzzle: string[], idx: number): boolean {
  let [forwardIdx, backwardIdx] = [idx, idx - 1]

  for (; backwardIdx >= 0 && forwardIdx < puzzle.length; forwardIdx++, backwardIdx--) {
    if (puzzle[backwardIdx] !== puzzle[forwardIdx]) return false
  }

  return true
}

function getVerticalPuzzle(puzzle: string[]): string[] {
  const verticalPuzzle: string[] = []

  for (let i = 0; i < puzzle[0].length; i++) {
    let strNumb = ''

    for (let j = 0; j < puzzle.length; j++) strNumb = puzzle[j][i] + strNumb

    verticalPuzzle.push(strNumb)
  }

  return verticalPuzzle
}

function getMirrorIdx(puzzle: string[]): number | undefined {
  for (let i = 1; i < puzzle.length; i++) {
    if (puzzle[i - 1] === puzzle[i]) {
      if (possibleMirror(puzzle, i)) return i
    }
  }
}

function analysePuzzle(puzzle: string[]) {
  const horizontal = getMirrorIdx(puzzle) ?? 0
  const vertical = getMirrorIdx(getVerticalPuzzle(puzzle)) ?? 0

  return { horizontal, vertical }
}

export function first() {
  let puzzle: string[] = []
  let sum = 0

  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length === 0 || i === input.length - 1) {
      if (i === input.length - 1) puzzle.push(line)

      const { horizontal, vertical } = analysePuzzle(puzzle)
      sum += horizontal * 100 + vertical
      puzzle = []
    } else puzzle.push(line)
  }

  console.log(sum)
}
