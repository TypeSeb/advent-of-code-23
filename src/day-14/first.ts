import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-14', 'input.txt'), 'utf-8').split('\n')

enum Direction {
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  NORTH = 'NORTH'
}

function tilt(direction: Direction) {
  let sum = 0

  if(direction === Direction.NORTH || direction === Direction.SOUTH) {
    for(let x = 0; x < input[0].length; x++) {
      let line = ''

      for(let y = 0; y < input.length; y++)
        line = input[y][x] + line

      const tilted = line.split('#').map(l => {
        const roundedRockCnt = (l.match(/O/g) || []).length 
        const roundedRocks = 'O'.repeat(roundedRockCnt)
        const emptySpace = '.'.repeat(l.length - roundedRockCnt)

        return (direction === Direction.NORTH) ? emptySpace + roundedRocks : roundedRocks + emptySpace
      }).join('#')

      for(let tiltedCnt = 0; tiltedCnt < tilted.length; tiltedCnt++) {
        const rowCnt = (direction === Direction.NORTH) ? tiltedCnt + 1 : tilted.length - tiltedCnt 
        if(tilted[tiltedCnt] === 'O') sum += rowCnt
      }
    }
  }

  if(direction === Direction.EAST || direction === Direction.WEST) {
    input.forEach(line => {
      const tilted = line.split('#').map(l => {
        const roundedRockCnt = (l.match(/O/g) || []).length 
        const roundedRocks = 'O'.repeat(roundedRockCnt)
        const emptySpace = '.'.repeat(l.length - roundedRockCnt)

        return (direction === Direction.EAST) ? emptySpace + roundedRocks : roundedRocks + emptySpace
      }).join('#')

      for(let tiltedCnt = 0; tiltedCnt < tilted.length; tiltedCnt++) {
        const rowCnt = (direction === Direction.EAST) ? tiltedCnt + 1 : tilted.length - tiltedCnt 
        if(tilted[tiltedCnt] === 'O') sum += rowCnt
      }
    })
  }

  console.log(sum)
}

export function first() {
  tilt(Direction.NORTH)
}
