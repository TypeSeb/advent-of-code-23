import { readFileSync } from 'fs'
import path from 'path'

enum Direction {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}

type Move = {
  dir: Direction
  steps: number
  color: { r: number; g: number; b: number }
}

const moves: Array<Move> = []

const input = readFileSync(path.join(__dirname, '../../src/day-18', 'input.txt'), 'utf-8').split('\n')
let blueprint: Array<string> = []

function findInside(): { x: number; y: number } {
  for (let x = 1; x < blueprint[0].length; x++) {
    if (blueprint[0][x] === '#' && blueprint[1][x] === ' ') return { x, y: 1 }
  }

  throw new Error('No inside found')
}

class SpanFill {
  private isValidSquare(x: number, y: number, colour: string) {
    return x > 0 && x < blueprint[0].length && y > 0 && y < blueprint.length && blueprint[y][x] === colour
  }

  fill(x: number, y: number) {
    const stack: { x: number; y: number; colour: string }[] = [{ x, y, colour: ' ' }]

    while (stack.length > 0) {
      const { x, y, colour } = stack.pop()!
      let lx = x

      while (this.isValidSquare(lx, y, colour)) {
        drawStep({ x: lx, y })
        lx = lx - 1
      }

      let rx = x + 1
      while (this.isValidSquare(rx, y, colour)) {
        drawStep({ x: rx, y })
        rx = rx + 1
      }
      this.scan(lx, rx - 1, y + 1, stack, colour)
      this.scan(lx, rx - 1, y - 1, stack, colour)
    }
  }

  private scan(lx: number, rx: number, y: number, stack: { x: number; y: number; colour: string }[], colour: string) {
    for (let i = lx; i < rx; i++) {
      if (this.isValidSquare(i, y, colour)) stack.push({ x: i, y: y, colour: colour })
    }
  }
}

function init() {
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }
  function getDirection(dir: string) {
    switch (dir) {
      case 'D':
        return Direction.SOUTH
      case 'U':
        return Direction.NORTH
      case 'R':
        return Direction.EAST
      case 'L':
        return Direction.WEST
      default:
        throw new Error(`Unhandled direction ${dir}`)
    }
  }

  input.forEach((line) => {
    const [dir, steps, color] = line.split(' ')

    moves.push({
      dir: getDirection(dir),
      steps: +steps,
      color: hexToRgb(color.slice(1, -1))
    })
  })
}

function drawStep({ x, y }: { x: number; y: number }) {
  if (blueprint.length) blueprint[y] = blueprint[y].substring(0, x) + '#' + blueprint[y].substring(x + 1)
}

function drawVerticalLine(
  length: number,
  current: { x: number; y: number },
  direction: Direction.NORTH | Direction.SOUTH
) {
  const step = direction === Direction.SOUTH ? 1 : -1
  drawStep(current)

  for (let i = 0; i < length; i++) {
    current.y += step
    drawStep(current)
  }
}

function drawHorizontalLine(
  length: number,
  current: { x: number; y: number },
  direction: Direction.EAST | Direction.WEST
) {
  const step = direction === Direction.EAST ? 1 : -1

  drawStep(current)

  for (let i = 0; i < length; i++) {
    current.x += step
    drawStep(current)
  }
}

export function first() {
  init()
  moves[0].steps -= 1

  const current = { x: 0, y: 0 }
  const min = { x: 0, y: 0 }
  const max = { x: 0, y: 0 }

  moves.forEach((move) => {
    if (move.dir === Direction.EAST || move.dir === Direction.WEST) drawHorizontalLine(move.steps, current, move.dir)
    if (move.dir === Direction.NORTH || move.dir === Direction.SOUTH) drawVerticalLine(move.steps, current, move.dir)

    if (max.x < current.x) max.x = current.x
    if (max.y < current.y) max.y = current.y
    if (min.x > current.x) min.x = current.x
    if (min.y > current.y) min.y = current.y
  })

  current.x = Math.abs(min.x)
  current.y = Math.abs(min.y)

  const xMax = Math.abs(min.x) + max.x + 1
  const yMax = Math.abs(min.y) + max.y + 1

  blueprint = new Array(yMax).fill(' '.repeat(xMax))

  moves.forEach((move) => {
    if (move.dir === Direction.EAST || move.dir === Direction.WEST) drawHorizontalLine(move.steps, current, move.dir)
    if (move.dir === Direction.NORTH || move.dir === Direction.SOUTH) drawVerticalLine(move.steps, current, move.dir)
  })

  const inside = findInside()
  if (!inside) throw new Error()

  new SpanFill().fill(inside.x, inside.y)

  console.log(
    blueprint.reduce((prev, curr) => {
      return prev + (curr.match(/#/g) || []).length
    }, 0)
  )
}
