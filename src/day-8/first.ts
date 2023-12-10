import { input } from './input'

type MappedLine = {
  key: string
  lhs: string
  rhs: string
}

function* navigateGenerator() {
  const navigate = input[0].split('').map((x) => (x === 'L' ? 0 : 1))
  let navigateIdx = 0

  while (true) {
    yield navigate[navigateIdx]

    navigateIdx++
    if (navigateIdx >= navigate.length) navigateIdx = 0
  }
}

function splitLine(line: string): MappedLine {
  const [key, lhs, rhs] = line.match(/[a-zA-Z]+/g)!.map(String)
  return { key, lhs, rhs }
}

function binarySearch(sortedArray: string[], seekElement: string): MappedLine {
  let startIndex = 0
  let endIndex: number = sortedArray.length - 1

  while (startIndex <= endIndex) {
    const mid = startIndex + Math.floor((endIndex - startIndex) / 2)
    const { key, lhs, rhs } = splitLine(sortedArray[mid])

    if (key === seekElement) {
      return { key, rhs, lhs }
    } else if (key > seekElement) {
      endIndex = mid - 1
    } else {
      startIndex = mid + 1
    }
  }

  throw new Error('Not found')
}

export function first() {
  const sortedMap = input.slice(1).sort((lhs, rhs) => {
    const lhsDestination = lhs.split(' =')[0]
    const rhsDestination = rhs.split(' =')[0]
    if (lhsDestination < rhsDestination) return -1
    else if (lhsDestination > rhsDestination) return 1
    return 0
  })

  let nextMap = splitLine(sortedMap[0])
  const navigate = navigateGenerator()

  let cnt = 1

  while (true) {
    const next = navigate.next().value
    const seekElement = next === 0 ? nextMap.lhs : nextMap.rhs

    if (seekElement === 'ZZZ') break

    nextMap = binarySearch(sortedMap, seekElement)
    cnt++
  }

  console.log(cnt)
}
