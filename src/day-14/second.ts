import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-14', 'input.txt'), 'utf-8').split('\n')

enum Direction {
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  NORTH = 'NORTH'
}

function tilt(input: string[], direction: Direction): string[] {
  const tiltedInput = new Array<string>(input.length).fill('')

  if (direction === Direction.NORTH || direction === Direction.SOUTH) {
    for (let x = 0; x < input[0].length; x++) {
      let line = ''

      for (let y = 0; y < input.length; y++) line = input[y][x] + line

      const tilted = line
        .split('#')
        .map((l) => {
          const roundedRockCnt = (l.match(/O/g) || []).length
          const roundedRocks = 'O'.repeat(roundedRockCnt)
          const emptySpace = '.'.repeat(l.length - roundedRockCnt)

          return direction === Direction.NORTH ? emptySpace + roundedRocks : roundedRocks + emptySpace
        })
        .join('#')

      for (let tiltedCnt = 0; tiltedCnt < tilted.length; tiltedCnt++)
        tiltedInput[tiltedCnt] += tilted[tilted.length - tiltedCnt - 1]
    }
  }

  if (direction === Direction.EAST || direction === Direction.WEST) {
    input.forEach((line, idx) => {
      const tilted = line
        .split('#')
        .map((l) => {
          const roundedRockCnt = (l.match(/O/g) || []).length
          const roundedRocks = 'O'.repeat(roundedRockCnt)
          const emptySpace = '.'.repeat(l.length - roundedRockCnt)

          return direction === Direction.EAST ? emptySpace + roundedRocks : roundedRocks + emptySpace
        })
        .join('#')

      tiltedInput[idx] = tilted
    })
  }

  return tiltedInput
}

export function second() {
  let tilted = [...input]
  const map = new Map<string, number>()
  const loops = 1000000000

  for (let i = 0; i < loops; i++) {
    tilted = tilt(tilted, Direction.NORTH)
    tilted = tilt(tilted, Direction.WEST)
    tilted = tilt(tilted, Direction.SOUTH)
    tilted = tilt(tilted, Direction.EAST)

    const joined = tilted.join('|')
    const mapIdx = map.get(joined)

    if (mapIdx === undefined) map.set(joined, i)
    else {
      const repeatLength = i - mapIdx

      const remainingLoops = (loops - mapIdx) % repeatLength
      const finishedMapIdx = mapIdx + remainingLoops - 1

      for (const [joinedTilted, idx] of map.entries()) {
        if (idx === finishedMapIdx) {
          tilted = joinedTilted.split('|')
          break
        }
      }

      break
    }
  }

  let sum = 0

  tilted.forEach((line, idx) => {
    for (let lineCnt = 0; lineCnt < line.length; lineCnt++) if (line[lineCnt] === 'O') sum += tilted.length - idx
  })

  console.log(sum)
}
