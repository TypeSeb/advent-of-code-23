import { input } from './input'

enum MapState {
  SEEDS,
  SEED_TO_SOIL_MAP,
  SOIL_TO_FERTILLIZER_MAP,
  FERTILLIZER_TO_WATER_MAP,
  WATER_TO_LIGHT_MAP,
  LIGHT_TO_TEMPERATURE_MAP,
  TEMPERATURE_TO_HUMIDITY_MAP,
  HUMIDITY_TO_LOCATION_MAP
}

type Mapping = {
  destinationRangeStart: number
  sourceRangeStart: number
  range: number
}

const seedToSoildMap: Mapping[] = []
const soilToFertilizerMap: Mapping[] = []
const fertilizerToWaterMap: Mapping[] = []
const waterToLightMap: Mapping[] = []
const lightToTemperatureMap: Mapping[] = []
const temperatureToHumidityMap: Mapping[] = []
const humidityToLocationMap: Mapping[] = []

const seeds: number[] = []

function prefillMap(mapping: Mapping, mappings: Mapping[]) {
  mappings.push(mapping)
}

function init() {
  let state: MapState = MapState.SEEDS

  for (let lineIdx = 0; lineIdx < input.length; lineIdx++) {
    const currentLine = input[lineIdx]

    if (currentLine.length === 0) continue

    switch (state) {
      case MapState.SEEDS:
        if (currentLine.startsWith('seeds: '))
          currentLine
            .match(/\d+/g)
            ?.map(Number)
            .forEach((x) => seeds.push(x))

        if (currentLine.startsWith('seed-to-soil map:')) state = MapState.SEED_TO_SOIL_MAP
        break

      case MapState.SEED_TO_SOIL_MAP:
        if (currentLine.startsWith('soil-to-fertilizer map:')) state = MapState.SOIL_TO_FERTILLIZER_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, seedToSoildMap)
        }
        break

      case MapState.SOIL_TO_FERTILLIZER_MAP:
        if (currentLine.startsWith('fertilizer-to-water map:')) state = MapState.FERTILLIZER_TO_WATER_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, soilToFertilizerMap)
        }
        break

      case MapState.FERTILLIZER_TO_WATER_MAP:
        if (currentLine.startsWith('water-to-light map:')) state = MapState.WATER_TO_LIGHT_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, fertilizerToWaterMap)
        }
        break

      case MapState.WATER_TO_LIGHT_MAP:
        if (currentLine.startsWith('light-to-temperature map:')) state = MapState.LIGHT_TO_TEMPERATURE_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, waterToLightMap)
        }
        break

      case MapState.LIGHT_TO_TEMPERATURE_MAP:
        if (currentLine.startsWith('temperature-to-humidity map:')) state = MapState.TEMPERATURE_TO_HUMIDITY_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, lightToTemperatureMap)
        }
        break

      case MapState.TEMPERATURE_TO_HUMIDITY_MAP:
        if (currentLine.startsWith('humidity-to-location map:')) state = MapState.HUMIDITY_TO_LOCATION_MAP
        else {
          const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
          prefillMap({ destinationRangeStart, sourceRangeStart, range }, temperatureToHumidityMap)
        }
        break

      case MapState.HUMIDITY_TO_LOCATION_MAP:
        const [destinationRangeStart, sourceRangeStart, range] = currentLine.match(/\d+/g)!.map(Number)!
        prefillMap({ destinationRangeStart, sourceRangeStart, range }, humidityToLocationMap)

        break

      default:
        state satisfies never
    }
  }
}

function findMapping(source: number, mappings: Mapping[]): number {
  const mapping = mappings.find(
    (mapping) => source >= mapping.sourceRangeStart && source < mapping.sourceRangeStart + mapping.range
  )

  if (mapping === undefined) return source

  const diff = source - mapping.sourceRangeStart

  return mapping.destinationRangeStart + diff
}

function mapSeeds() {
  let lowestLocation = Number.MAX_VALUE

  seeds.forEach((seed) => {
    const mapToSoild = findMapping(seed, seedToSoildMap)
    const mapToFertilizer = findMapping(mapToSoild, soilToFertilizerMap)
    const mapToWater = findMapping(mapToFertilizer, fertilizerToWaterMap)
    const mapToLight = findMapping(mapToWater, waterToLightMap)
    const mapToTemperature = findMapping(mapToLight, lightToTemperatureMap)
    const mapToHumidity = findMapping(mapToTemperature, temperatureToHumidityMap)
    const location = findMapping(mapToHumidity, humidityToLocationMap)

    if (location < lowestLocation) lowestLocation = location
  })

  console.log(lowestLocation)
}

export function first() {
  init()
  mapSeeds()
}
