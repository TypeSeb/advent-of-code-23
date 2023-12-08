import { input } from './input'

const numbersLookup = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

function reverseString(str: string): string {
  return str.split('').reverse().join('')
}

function tryLetterNumber(str: string, reverse: boolean = false): number | undefined {
  let minSearchIdx = str.length + 1
  let possibleNumber = 0

  for (const { value, idx } of numbersLookup.map((value, idx) => ({ value, idx }))) {
    const valueStr = reverse ? reverseString(value) : value
    const searchIdx = str.search(valueStr)

    if (searchIdx >= 0 && searchIdx < minSearchIdx) {
      minSearchIdx = searchIdx
      possibleNumber = idx + 1
    }
  }

  if (minSearchIdx === str.length + 1) return

  // Number comes before
  for (let i = 0; i < minSearchIdx; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode >= 0x30 && charCode <= 0x39) return
  }

  return possibleNumber
}

function getFirstNumber(str: string): number {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode >= 0x30 && charCode <= 0x39) return charCode - 0x30
  }

  throw new Error('No number found')
}

function getNumber(str: string): number {
  const strReverse = str.split('').reverse().join('')

  let leftNumber = tryLetterNumber(str)
  if (leftNumber === undefined) leftNumber = getFirstNumber(str)

  let rightNumber = tryLetterNumber(strReverse, true)
  if (rightNumber === undefined) rightNumber = getFirstNumber(strReverse)

  return leftNumber * 10 + rightNumber
}

let sum = 0
input.forEach((value) => (sum += getNumber(value)))
console.log(sum)
