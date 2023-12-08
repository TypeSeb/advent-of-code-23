import { partNumbers } from "./input"

type SlidingWindowEntry = {
  lineIndicies: number[],
  lineNumbers: number[],
}

type SlidingWindow = {
  above: SlidingWindowEntry
  current:SlidingWindowEntry
  next: SlidingWindowEntry
}

let partNumberSum = 0
const slidingWindow: SlidingWindow = {
  above: {
    lineIndicies: [],
    lineNumbers: [],
  },
  current: {
    lineIndicies: [],
    lineNumbers: [],
  },
  next: {
    lineIndicies: [],
    lineNumbers: [],
  }
}

function isGearSign(charCode: number) {
  return charCode === '*'.charCodeAt(0)
}

function isDigit(charCode: number) {
  return charCode >= 0x30 && charCode <= 0x39
}

function getDigit(charCode: number) {
  return charCode - 0x30 
}

function parseLine(lineNumber: number) {
  let number = 0
  let numberIndicies: number[] = []
  let numbers: number[] = []

  if(lineNumber < 0 || lineNumber >= partNumbers.length)
    return {numbers, numberIndicies}

  for(let charIdx = 0; charIdx < partNumbers[lineNumber].length; charIdx++) {
    const charCode = partNumbers[lineNumber].charCodeAt(charIdx)

    if(isDigit(charCode)) {
      number = number * 10 + getDigit(charCode)
      numberIndicies.push(numbers.length)
      continue;
    }

    if(number) {
      numbers.push(number)
      number = 0
    }

    numberIndicies.push(-1)
  }

  if(number) {
    numbers.push(number)
    number = 0
  }

  return {numbers, numberIndicies}
}

function checkForNumbers(entry: SlidingWindowEntry, gearIdx: number): number[] {
  const numbers: number[] = []

  if(entry.lineIndicies.length > gearIdx) {
    const idx = entry.lineIndicies[gearIdx]
    const leftSideIdx = (gearIdx > 0) ? entry.lineIndicies[gearIdx - 1] : -1
    const rightSideIdx = (gearIdx + 1 < entry.lineIndicies.length) ? entry.lineIndicies[gearIdx + 1] : -1

    const uniqueIndicies = new Set([idx, leftSideIdx, rightSideIdx])
    uniqueIndicies.delete(-1)
    uniqueIndicies.forEach(elem => numbers.push(entry.lineNumbers[elem]))
  }
  
  return numbers
}

export function second() {
  let startLineIdx = 0

  let sum = 0

  let line = parseLine(startLineIdx++)
  slidingWindow.above.lineIndicies = line.numberIndicies
  slidingWindow.above.lineNumbers = line.numbers

  line = parseLine(startLineIdx)
  slidingWindow.current.lineIndicies = line.numberIndicies
  slidingWindow.current.lineNumbers = line.numbers

  for(let lineNumber = startLineIdx; lineNumber < partNumbers.length; lineNumber++) {

    line = parseLine(lineNumber + 1)
    slidingWindow.next.lineIndicies = line.numberIndicies
    slidingWindow.next.lineNumbers = line.numbers

    const currentLine = partNumbers[lineNumber]

    for(let lineIdx = 0; lineIdx <= currentLine.length; lineIdx++) {
      const charCode = currentLine.charCodeAt(lineIdx)

      if(isGearSign(charCode)) {
        const above = checkForNumbers(slidingWindow.above, lineIdx)
        const current = checkForNumbers(slidingWindow.current, lineIdx)
        const next = checkForNumbers(slidingWindow.next, lineIdx)

        const allNumbers = [...above, ...current, ...next]

        if(allNumbers.length === 2)
          sum += allNumbers[0] * allNumbers[1]
      }
    }

    slidingWindow.above.lineIndicies = slidingWindow.current.lineIndicies
    slidingWindow.above.lineNumbers = slidingWindow.current.lineNumbers

    slidingWindow.current.lineIndicies = slidingWindow.next.lineIndicies
    slidingWindow.current.lineNumbers = slidingWindow.next.lineNumbers
  }

  console.log(sum)
}