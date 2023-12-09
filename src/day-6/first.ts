import { input } from './input'

export function first() {
  const times = input[0].match(/\d+/g)!.map(Number)

  const distances = input[1].match(/\d+/g)!.map(Number)

  const sum: number[] = []

  for (let i = 0; i < times.length; i++) {
    const beatsRaceRecord = []
    const time = times[i]
    const recordDistance = distances[i]

    for (let loadTime = 1; loadTime < time; loadTime++) {
      const travelTime = time - loadTime
      const distance = travelTime * loadTime

      if (distance > recordDistance) beatsRaceRecord.push(loadTime)
    }
    sum.push(beatsRaceRecord.length)
  }

  console.log(sum.reduce((a, b) => a * b))
}
