import { input } from './input'

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

  const verticalPuzzle = getVerticalPuzzle(puzzle)

  const vertical = getMirrorIdx(verticalPuzzle) ?? 0

  return { horizontal, vertical }
}

export function first() {
  let puzzle: string[] = []
  let sum = 0

  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length === 0) {
      const { horizontal, vertical } = analysePuzzle(puzzle)
      sum += horizontal * 100 + vertical
      puzzle = []
    } else puzzle.push(line.replace(/\./g, '1').replace(/#/g, '2'))
  }

  console.log(sum)
}
