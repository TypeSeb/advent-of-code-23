import { readFileSync } from 'fs'
import path from 'path'

const inputs = readFileSync(path.join(__dirname, '../../src/day-15', 'input.txt'), 'utf-8').split(',')

type Lens = {
  key: string
  lable: number
}

const boxes: Map<number, Array<Lens>> = new Map()

function strHash(str: string): number {
  let hashResult = 0

  for (const char of str) {
    hashResult += char.charCodeAt(0)
    hashResult *= 17
    hashResult %= 256
  }

  return hashResult
}

function handleToken(str: string) {
  if (str.includes('=')) {
    const [toHash, lensLable] = str.split('=')
    const hash = strHash(toHash)

    const box = boxes.get(hash)
    if (box) {
      const lensEntry = box.find((x) => x.key === toHash)

      if (lensEntry) lensEntry.lable = +lensLable
      else box.push({ key: toHash, lable: +lensLable })
    } else boxes.set(hash, [{ key: toHash, lable: +lensLable }])
  } else if (str.endsWith('-')) {
    const toHash = str.substring(0, str.length - 1)
    const hash = strHash(toHash)

    const box = boxes.get(hash)
    if (box) {
      const toRemoveIdx = box.findIndex((x) => x.key === toHash)
      if (toRemoveIdx >= 0) box.splice(toRemoveIdx, 1)
    }
  }
}

export function second() {
  inputs.forEach((input) => handleToken(input))

  let sum = 0

  for (const [box, lenses] of boxes.entries()) {
    for (const [lensNumber, lens] of lenses.entries()) {
      sum += (box + 1) * (lensNumber + 1) * lens.lable
    }
  }

  console.log(sum)
}
