import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-6', 'input.txt'), 'utf-8').split('\n')

export function second() {
  const time = +input[0].match(/\d+/g)!.map(Number).join('')
  const recordDistance = +input[1].match(/\d+/g)!.map(Number).join('')

  let beatsRaceRecord = 0

  for (let loadTime = 1; loadTime < time; loadTime++) {
    const travelTime = time - loadTime
    const distance = travelTime * loadTime

    if (distance > recordDistance) beatsRaceRecord++
  }

  console.log(beatsRaceRecord)
}
