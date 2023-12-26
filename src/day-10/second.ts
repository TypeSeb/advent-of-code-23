import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-10', 'input.txt'), 'utf-8').split('\n')

const blueprint: Array<string> = []
input.forEach((x) => blueprint.push(' '.repeat(x.length)))

enum Side {
  ABOVE,
  LEFT,
  RIGHT,
  BELOW
}

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

const floodFill = (image: Array<string>, y: number, x: number, setVal: string = '#') => {
  if (y < 0 || x < 0) return

  if (y > image.length - 1 || x > image[0].length - 1) return

  const current = image[y][x]

  if (current === setVal) return image

  if (current !== ' ') return image

  fill(image, y, x, setVal, current)

  return image
}

const fill = (image: Array<string>, y: number, x: number, setVal: string, current: string) => {
  if (y < 0 || x < 0) return

  if (y > image.length - 1 || x > image[0].length - 1) return

  if (image[y][x] !== current) return

  image[y] = image[y].substring(0, x) + setVal + image[y].substring(x + 1)

  fill(image, y - 1, x, setVal, current)
  fill(image, y + 1, x, setVal, current)
  fill(image, y, x - 1, setVal, current)
  fill(image, y, x + 1, setVal, current)
}

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

function fillBluePrint() {
  const directions = [Direction.UP] // LEFT & RIGH not correct ?!

  for (const direction of directions) {
    let currentDirection: Direction = direction

    currentX = startX
    currentY = startY

    while (true) {
      let char = '\u2500'
      if (input[currentY][currentX] === Pipes.VERTICAL) char = '\u2502'
      if (input[currentY][currentX] === Pipes.VERTICAL) char = '\u2502'
      if (input[currentY][currentX] === Pipes.SW90) char = '\u2510'
      if (input[currentY][currentX] === Pipes.SE90) char = '\u250C'
      if (input[currentY][currentX] === Pipes.NE90) char = '\u2514'
      if (input[currentY][currentX] === Pipes.NW90) char = '\u2518'

      blueprint[currentY] =
        blueprint[currentY].substring(0, currentX) + char + blueprint[currentY].substring(currentX + 1)

      currentDirection = getNextDirection(currentDirection)
      if (input[currentY][currentX] === Pipes.START) break
    }
  }
}

function fillInside(outside?: Side) {
  if (outside !== undefined) {
    switch (outside) {
      case Side.ABOVE:
        floodFill(blueprint, currentY + 1, currentX)
        break
      case Side.BELOW:
        floodFill(blueprint, currentY - 1, currentX)
        break
      case Side.LEFT:
        floodFill(blueprint, currentY, currentX + 1)
        break
      case Side.RIGHT:
        floodFill(blueprint, currentY, currentX - 1)
        break
    }
  }
}

function nextOutside(currentDirection: Direction, nextDirection: Direction, outside: Side) {
  if (currentDirection === Direction.LEFT && nextDirection === Direction.UP) {
    if (outside === Side.ABOVE) return Side.RIGHT
    if (outside === Side.BELOW) return Side.LEFT
  }
  if (currentDirection === Direction.LEFT && nextDirection === Direction.DOWN) {
    if (outside === Side.ABOVE) return Side.LEFT
    if (outside === Side.BELOW) return Side.RIGHT
  }
  if (currentDirection === Direction.RIGHT && nextDirection === Direction.UP) {
    if (outside === Side.ABOVE) return Side.LEFT
    if (outside === Side.BELOW) return Side.RIGHT
  }
  if (currentDirection === Direction.RIGHT && nextDirection === Direction.DOWN) {
    if (outside === Side.ABOVE) return Side.RIGHT
    if (outside === Side.BELOW) return Side.LEFT
  }
  if (currentDirection === Direction.UP && nextDirection === Direction.RIGHT) {
    if (outside === Side.RIGHT) return Side.BELOW
    if (outside === Side.LEFT) return Side.ABOVE
  }
  if (currentDirection === Direction.UP && nextDirection === Direction.LEFT) {
    if (outside === Side.RIGHT) return Side.ABOVE
    if (outside === Side.LEFT) return Side.BELOW
  }
  if (currentDirection === Direction.DOWN && nextDirection === Direction.RIGHT) {
    if (outside === Side.RIGHT) return Side.ABOVE
    if (outside === Side.LEFT) return Side.BELOW
  }
  if (currentDirection === Direction.DOWN && nextDirection === Direction.LEFT) {
    if (outside === Side.RIGHT) return Side.BELOW
    if (outside === Side.LEFT) return Side.ABOVE
  }

  return outside
}

function findAndFillOutside() {
  let currentDirection: Direction = Direction.UP

  let outside: Side | undefined = undefined

  currentX = startX
  currentY = startY

  let loopCnt = 0
  while (loopCnt <= 1) {
    const nextDirection = getNextDirection(currentDirection)

    if ((nextDirection === Direction.LEFT && currentY === 0) || (nextDirection === Direction.RIGHT && currentY === 0))
      outside = Side.ABOVE

    fillInside(outside)

    if (outside !== undefined) outside = nextOutside(currentDirection, nextDirection, outside)

    currentDirection = nextDirection

    fillInside(outside)

    if (input[currentY][currentX] === Pipes.START) loopCnt++
  }
}

export function second() {
  init()
  fillBluePrint()
  findAndFillOutside()

  let sum = 0
  blueprint.forEach((line) => (sum += line.split('#').length - 1))
  console.log(sum)
}
