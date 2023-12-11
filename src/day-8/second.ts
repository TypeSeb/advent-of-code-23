import { input } from './input'

function* navigateGenerator() {
  const navigate = input[0].split('').map((x) => (x === 'L' ? 0 : 1))
  let navigateIdx = 0

  while (true) {
    yield navigate[navigateIdx]

    navigateIdx++
    if (navigateIdx >= navigate.length) navigateIdx = 0
  }
}

function splitLine(line: string): { key: string; lhs: string; rhs: string } {
  const [key, lhs, rhs] = line.match(/[a-zA-Z0-9]+/g)!.map(String)
  return { key, lhs, rhs }
}

export function second() {
  const map: Map<string, [string, string]> = new Map()

  input.forEach((line) => {
    const { key, lhs, rhs } = splitLine(line)
    map.set(key, [lhs, rhs])
  })

  const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)

  let lcmResult = 1

  map.forEach((values, key) => {
    if (key.endsWith('A')) {
      const navigate = navigateGenerator()
      let cnt = 1
      let nextKey = values[navigate.next().value!]

      while (true) {
        if (nextKey.endsWith('Z')) break

        const entry = map.get(nextKey)!
        nextKey = entry[navigate.next().value!]

        cnt++
      }

      lcmResult = lcm(lcmResult, cnt)
    }
  })

  console.log(lcmResult)
}
