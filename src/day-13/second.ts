import { input } from '../day-13/input'

function possibleMirror(puzzle: string[], idx: number): { idx: number; fixed: boolean } | undefined {
  let [forwardIdx, backwardIdx] = [idx, idx - 1]
  const errorPos: { line: string; idx: number }[] = []

  for (; backwardIdx >= 0 && forwardIdx < puzzle.length; forwardIdx++, backwardIdx--) {
    const backwardPuzzle = puzzle[backwardIdx]
    const forwardPuzzle = puzzle[forwardIdx]

    for (let i = 0; i < backwardPuzzle.length; i++) {
      if (backwardPuzzle[i] !== forwardPuzzle[i])
        errorPos.push({ line: forwardPuzzle, idx: Math.min(backwardIdx, forwardIdx) })
    }
  }

  if (errorPos.length === 1) {
    puzzle[errorPos[0].idx] = errorPos[0].line
    return { idx, fixed: true }
  }
  if (errorPos.length > 1) return

  return { idx, fixed: false }
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

function getMirrorIdx(puzzle: string[]): { idx: number; fixed: boolean } | undefined {
  let tmpPossibleMirrorIdx: { idx: number; fixed: boolean } | undefined = undefined

  for (let i = 1; i < puzzle.length; i++) {
    const possibleMirrorIdx = possibleMirror(puzzle, i)
    if (possibleMirrorIdx !== undefined) tmpPossibleMirrorIdx = possibleMirrorIdx
    if (tmpPossibleMirrorIdx?.fixed) return tmpPossibleMirrorIdx
  }

  return tmpPossibleMirrorIdx
}

function analysePuzzle(puzzle: string[]) {
  const horizontal = getMirrorIdx(puzzle)
  const vertical = getMirrorIdx(getVerticalPuzzle(puzzle))

  if (horizontal && horizontal.fixed) return horizontal.idx * 100
  if (vertical && vertical.fixed) return vertical.idx
}

export function second() {
  let puzzle: string[] = []
  let sum = 0

  for (let i = 0; i < input.length; i++) {
    const line = input[i]

    if (line.length === 0) {
      const cnt = analysePuzzle(puzzle) ?? 0
      sum += cnt
      puzzle = []
    } else puzzle.push(line)
  }

  console.log(sum)
}
