import { input } from './input'

enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN'
}

enum Pipes {
  VERTICAL = '|',
  HORIZONTAL = '-',
  NE90 = 'L',
  NW90 = 'J',
  SW90 = '7',
  SE90 = 'F',
  GROUND = '.',
  START = 'S'
}

let startX = 0
let startY = 0

const maxX = input[0].length
const maxY = input.length

let currentX = 0
let currentY = 0

function init() {
  // find startpoint
  for (const [lineIdx, line] of input.entries()) {
    const startFoundAt = line.indexOf(Pipes.START)

    if (startFoundAt >= 0) {
      startX = startFoundAt
      startY = lineIdx
      break
    }
  }
}

function getNextDirection(currentDirection: Direction): Direction {
  let nextDirection: Direction = currentDirection

  switch (currentDirection) {
    case Direction.UP:
      if (currentY > 0) {
        currentY -= 1
        const nextStep = input[currentY][currentX]
        if (nextStep === Pipes.SE90) nextDirection = Direction.RIGHT
        else if (nextStep === Pipes.SW90) nextDirection = Direction.LEFT
        else if (nextStep === Pipes.VERTICAL) nextDirection = Direction.UP
      }
      break
    case Direction.DOWN:
      if (currentY < maxY - 1) {
        currentY += 1
        const nextStep = input[currentY][currentX]
        if (nextStep === Pipes.NE90) nextDirection = Direction.RIGHT
        else if (nextStep === Pipes.NW90) nextDirection = Direction.LEFT
        else if (nextStep === Pipes.VERTICAL) nextDirection = Direction.DOWN
      }
      break
    case Direction.LEFT:
      if (currentX > 0) {
        currentX -= 1
        const nextStep = input[currentY][currentX]
        if (nextStep === Pipes.SE90) nextDirection = Direction.DOWN
        else if (nextStep === Pipes.NE90) nextDirection = Direction.UP
        else if (nextStep === Pipes.HORIZONTAL) nextDirection = Direction.LEFT
      }
      break
    case Direction.RIGHT:
      if (currentX < maxX - 1) {
        currentX += 1
        const nextStep = input[currentY][currentX]
        if (nextStep === Pipes.SW90) nextDirection = Direction.DOWN
        else if (nextStep === Pipes.NW90) nextDirection = Direction.UP
        else if (nextStep === Pipes.HORIZONTAL) nextDirection = Direction.RIGHT
      }
      break
  }

  return nextDirection
}

let maxSteps = 0
function run() {
  const directions = [Direction.UP, Direction.LEFT, Direction.RIGHT, Direction.DOWN] // LEFT & RIGH not correct ?!

  for (const direction of directions) {
    let steps = 0
    let currentDirection: Direction = direction

    currentX = startX
    currentY = startY

    while (true) {
      currentDirection = getNextDirection(currentDirection)
      steps++

      if (input[currentY][currentX] === Pipes.START) break
    }
    maxSteps = maxSteps < steps ? steps : maxSteps
  }
}

export function first() {
  init()
  run()
  console.log(Math.floor(maxSteps / 2 + 0.5))
}
