import { input } from './input'

type Galaxy = {
  x: number,
  y: number
}

function findGalaxies(): Galaxy[] {
  const galaxies: Galaxy[] = []

  for(const [y, line] of input.entries()) {
    for(let x = 0; x < line.length; x++)
      if(line[x] === '#')
        galaxies.push({x, y})
  }

  return galaxies
}

function searchForExpand(): {columns: number[], rows: number[]} {
  const columns: number[] = []
  const rows: number[] = []

  for(let x = 0; x < input[0].length; x++)
    if(input[0][x] === '.') {
      let y = 1
      for(; y < input.length; y++)
        if(input[y][x] !== '.')
          break;
      if(y === input.length)
        columns.push(x)
    }

  for(let y = 0; y < input.length; y++)
    if(input[y].includes('#') === false)
      rows.push(y)

  return {columns, rows}
}

function expand(galaxies: Galaxy[], toExpand: {columns: number[], rows: number[]}, times: number) {
  // Expand columns
  galaxies.sort((a, b) => a.x - b.x)

  const columns = toExpand.columns.sort((a, b) => b - a)

  columns.forEach(column => {
    let idx = galaxies.findIndex(galaxy => galaxy.x >= column)
    for(; idx < galaxies.length; idx++)
      galaxies[idx].x += (times - 1)
  })

  // Expand rows
  galaxies.sort((a, b) => a.y - b.y)

  const rows = toExpand.rows.sort((a, b) => b - a)

  rows.forEach(row => {
    let idx = galaxies.findIndex(galaxy => galaxy.y >= row)
    for(; idx < galaxies.length; idx++)
      galaxies[idx].y += (times - 1)
  })
}

function countShortestDistances(galaxies: Galaxy[]): number{

  let distances = 0

  for(let i = 0; i < galaxies.length - 1; i++) {
    const galaxy1 = galaxies[i]
    for(let j = i + 1; j < galaxies.length; j++) {
      const galaxy2 = galaxies[j]
      const xDiff = Math.abs(galaxy1.x - galaxy2.x)
      const yDiff = Math.abs(galaxy1.y - galaxy2.y)

      distances += xDiff + yDiff
    }
  }

  return distances
}

export function second() {
  const galaxies = findGalaxies()
  const toExpand = searchForExpand()

  expand(galaxies, toExpand, 1000000)

  console.log(countShortestDistances(galaxies))
}

