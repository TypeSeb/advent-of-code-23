import { games } from "./input"

const toMatchSet: CubeSet= {red: 12, green: 13, blue: 14}

type CubeSet = {red: number, blue: number, green: number}
type GameSet = {id: number, sets: CubeSet[]}

function parser(set: string): CubeSet {
  const cubeSet: CubeSet = {red: 0, blue: 0, green: 0}

  const cubes = set.split(',')

  cubes.forEach(cube => {
    const splits = cube.trim().split(' ')
    const number = +splits[0]
    switch(splits[1]) {
      case 'blue': 
        cubeSet.blue = number
        break;
      case 'green': 
        cubeSet.green = number
        break;
      case 'red': 
        cubeSet.red = number
        break;
    }
  })

  return cubeSet
}

function getGameSet(game: string): GameSet{
  const id = +game.substring('Game '.length).split(':')[0]

  const setsStr = game.split(':')[1].split(';')

  return {id, sets: setsStr.map(setStr => parser(setStr))}
}

function findGameSet(game: GameSet): number | undefined {

  for(const gameSet of game.sets) {
    if(gameSet.blue > toMatchSet.blue || gameSet.green > toMatchSet.green || gameSet.red > toMatchSet.red)
      return
  }

  return game.id
}

export function first() {
	const gameSets: GameSet[] = games.map(game => getGameSet(game))

	const possibleGames = gameSets.map(gameSet => findGameSet(gameSet) )

	let initValue = 0

	for(const possibleGame of possibleGames)
		initValue += (possibleGame !== undefined) ? possibleGame : 0

	console.log(initValue)
}