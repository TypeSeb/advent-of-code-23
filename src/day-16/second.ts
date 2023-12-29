import { readFileSync } from 'fs'
import path from 'path'

enum Direction {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST'
}

type Position = {
  x: number
  y: number
}

const input = readFileSync(path.join(__dirname, '../../src/day-16', 'input.txt'), 'utf-8').split('\n')
const xMax = input[0].length
const yMax = input.length

function handleSlash(direction: Direction): Direction {
  switch (direction) {
    case Direction.EAST:
      return Direction.NORTH
    case Direction.WEST:
      return Direction.SOUTH
    case Direction.NORTH:
      return Direction.EAST
    case Direction.SOUTH:
      return Direction.WEST
    default:
      direction satisfies never
  }

  throw new Error('unhandeld direction')
}

function handleBackSlash(direction: Direction): Direction {
  switch (direction) {
    case Direction.EAST:
      return Direction.SOUTH
    case Direction.WEST:
      return Direction.NORTH
    case Direction.NORTH:
      return Direction.WEST
    case Direction.SOUTH:
      return Direction.EAST
    default:
      direction satisfies never
  }

  throw new Error('unhandeld direction')
}

function handleHorizontalSplitter(direction: Direction): Direction[] {
  switch (direction) {
    case Direction.EAST:
      return [direction]
    case Direction.WEST:
      return [direction]
    case Direction.NORTH:
      return [Direction.EAST, Direction.WEST]
    case Direction.SOUTH:
      return [Direction.EAST, Direction.WEST]
    default:
      direction satisfies never
  }

  throw new Error('unhandeld direction')
}

function handleVerticalSplitter(direction: Direction): Direction[] {
  switch (direction) {
    case Direction.EAST:
      return [Direction.NORTH, Direction.SOUTH]
    case Direction.WEST:
      return [Direction.NORTH, Direction.SOUTH]
    case Direction.NORTH:
      return [direction]
    case Direction.SOUTH:
      return [direction]
    default:
      direction satisfies never
  }

  throw new Error('unhandeld direction')
}

function getNextPosition({ x, y }: Position, direction: Direction): Position {
  switch (direction) {
    case Direction.EAST:
      x++
      break
    case Direction.WEST:
      x--
      break
    case Direction.SOUTH:
      y++
      break
    case Direction.NORTH:
      y--
      break
    default:
      direction satisfies never
  }

  return { x, y }
}

const stringify = (pos: Position, dir: Direction) => `dir:${dir}|x:${pos.x}|y:${pos.y}`

function run(position: Position, direction: Direction) {
  while (true) {
    if (position.x < 0 || position.x >= xMax) break
    if (position.y < 0 || position.y >= yMax) break

    blueprint[position.y] =
      blueprint[position.y].substring(0, position.x) + '#' + blueprint[position.y].substring(position.x + 1)

    const char = input[position.y][position.x]
    let nextDirection: Direction | Direction[] = direction

    if (char === '/') {
      const nextDir = handleSlash(direction)
      if (mirrors.find((mirror) => mirror === stringify(position, nextDir))) break

      nextDirection = nextDir

      mirrors.push(stringify(position, nextDirection))
    } else if (char === '\\') {
      const nextDir = handleBackSlash(direction)
      if (mirrors.find((mirror) => mirror === stringify(position, nextDir))) break

      nextDirection = nextDir

      mirrors.push(stringify(position, nextDirection))
    } else if (char === '-') nextDirection = handleHorizontalSplitter(direction)
    else if (char === '|') nextDirection = handleVerticalSplitter(direction)

    if (Array.isArray(nextDirection)) {
      const nextDirections = nextDirection.map((next) => {
        return { direction: next, position: getNextPosition({ ...position }, next) }
      })
      nextDirections.forEach((next) => {
        if (mirrors.find((mirror) => mirror === stringify(position, next.direction))) return

        mirrors.push(stringify(position, next.direction))
        run(next.position, next.direction)
      })
      break
    } else {
      position = getNextPosition({ ...position }, nextDirection)
      direction = nextDirection
    }
  }
}

let blueprint: Array<string> = new Array(yMax).fill(' '.repeat(xMax))
let mirrors: string[] = []

function getEnergized(position: Position, direction: Direction) {
  blueprint = new Array(yMax).fill(' '.repeat(xMax))
  mirrors = []

  run({ ...position }, direction)

  const energized = blueprint.reduce((prev, curr) => {
    return prev + (curr.match(/#/g) || []).length
  }, 0)

  return energized
}

export function second() {
  let maxEnergized = 0

  for (let i = 0; i < xMax; i++) {
    let energized = getEnergized({ y: 0, x: i }, Direction.SOUTH)
    if (energized > maxEnergized) maxEnergized = energized

    energized = getEnergized({ y: yMax - 1, x: i }, Direction.NORTH)
    if (energized > maxEnergized) maxEnergized = energized
  }

  for (let i = 0; i < yMax; i++) {
    let energized = getEnergized({ y: i, x: 0 }, Direction.EAST)
    if (energized > maxEnergized) maxEnergized = energized

    energized = getEnergized({ y: i, x: xMax - 1 }, Direction.WEST)
    if (energized > maxEnergized) maxEnergized = energized
  }

  console.log(maxEnergized)
}
