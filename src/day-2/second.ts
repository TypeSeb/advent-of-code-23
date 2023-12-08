import { games } from './input'

type CubeSet = { red: number; blue: number; green: number }
type GameSet = { id: number; sets: CubeSet[] }

function parser(set: string): CubeSet {
  const cubeSet: CubeSet = { red: 0, blue: 0, green: 0 }

  const cubes = set.split(',')

  cubes.forEach((cube) => {
    const splits = cube.trim().split(' ')
    const number = +splits[0]
    switch (splits[1]) {
      case 'blue':
        cubeSet.blue = number
        break
      case 'green':
        cubeSet.green = number
        break
      case 'red':
        cubeSet.red = number
        break
    }
  })

  return cubeSet
}

function getGameSet(game: string): GameSet {
  const id = +game.substring('Game '.length).split(':')[0]

  const setsStr = game.split(':')[1].split(';')

  return { id, sets: setsStr.map((setStr) => parser(setStr)) }
}

function findMinimumSet(game: GameSet): CubeSet {
  const cubeSet: CubeSet = { red: 0, blue: 0, green: 0 }

  for (const gameSet of game.sets) {
    if (cubeSet.green < gameSet.green) cubeSet.green = gameSet.green
    if (cubeSet.red < gameSet.red) cubeSet.red = gameSet.red
    if (cubeSet.blue < gameSet.blue) cubeSet.blue = gameSet.blue
  }

  return cubeSet
}

export function second() {
  const gameSets: GameSet[] = games.map((game) => getGameSet(game))

  const possibleGames = gameSets.map((gameSet) => findMinimumSet(gameSet))
  const powers = possibleGames.map((gameSet) => gameSet.blue * gameSet.red * gameSet.green)

  let sum = 0
  for (const power of powers) sum += power

  console.log(sum)
}
