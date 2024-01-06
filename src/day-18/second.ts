import { readFileSync } from 'fs'
import path from 'path'

type Corner = {
  x: number
  y: number
}

enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}

const input = readFileSync(path.join(__dirname, '../../src/day-18', 'input.txt'), 'utf-8').split('\n')

const corners: Array<Corner> = []
let surfaceArea = 0

function init() {
  function getSteps(hex: string) {
    return parseInt(hex, 16)
  }

  function getDirection(dir: string) {
    switch (dir) {
      case '0':
        return Direction.EAST
      case '1':
        return Direction.SOUTH
      case '2':
        return Direction.WEST
      case '3':
        return Direction.NORTH
      default:
        throw new Error(`Unhandled direction ${dir}`)
    }
  }

  const current = { x: 0, y: 0 }

  input.forEach((line, idx) => {
    const stepsHex = line.split(' ')[2].slice(2, -2)
    const directionHex = line.split(' ')[2].slice(-2, -1)
    surfaceArea += getSteps(stepsHex)

    const steps = idx === 0 ? getSteps(stepsHex) - 1 : getSteps(stepsHex)
    const direction = getDirection(directionHex)

    if (direction === Direction.NORTH) current.y -= steps
    else if (direction === Direction.SOUTH) current.y += steps
    else if (direction === Direction.EAST) current.x += steps
    else if (direction === Direction.WEST) current.x -= steps

    corners.push({ ...current })
  })

  surfaceArea /= 2
}

export function second() {
  init()

  const xMin = Math.abs(Math.min(...corners.map((corner) => corner.x)))
  const yMin = Math.abs(Math.min(...corners.map((corner) => corner.y)))

  corners.forEach((corner) => {
    corner.x += xMin
    corner.y += yMin
  })

  let sum = 0

  corners.push(corners[0])

  for (let i = 0; i < corners.length - 1; i++) {
    const c1 = corners[i]
    const c2 = corners[i + 1]

    const x0x1 = c1.x + c2.x
    const y0y1 = c2.y - c1.y

    sum += x0x1 * y0y1
  }

  console.log(sum / 2 + surfaceArea + 1)
}
