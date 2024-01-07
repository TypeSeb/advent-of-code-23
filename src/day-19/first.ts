import { readFileSync } from 'fs'
import path from 'path'

const input = readFileSync(path.join(__dirname, '../../src/day-19', 'input.txt'), 'utf-8').split('\n\n')

const workflows = input[0].split('\n')
const partRatings = input[1].split('\n')

type Categories = 'x' | 'm' | 'a' | 's'

type Condition = {
  lhs: Categories
  fn: (lhs: number) => boolean
  next: string | 'A' | 'R'
}

type Workflow = {
  conditions: Condition[]
  default: string | 'A' | 'R'
}

function lessThan(rhs: number) {
  return function (lhs: number) {
    return lhs < rhs
  }
}

function greaterThan(rhs: number) {
  return function (lhs: number) {
    return lhs > rhs
  }
}

const workflowsMap: Map<string, Workflow> = new Map()

function init() {
  workflows.forEach((workflow) => {
    const workflowIdx = workflow.split('{')[0]
    const conditions = workflow.substring(workflow.indexOf('{') + 1, workflow.lastIndexOf('}')).split(',')

    const wf: Workflow = { default: 'R', conditions: [] }

    conditions.forEach((condition) => {
      if (condition.includes(':')) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, lhs, gtlt, rhs, next] = /^(\w)(<|>)(\d+):(\w+)$/i.exec(condition)!

        if (gtlt === '<') wf.conditions.push({ lhs: lhs as Categories, fn: lessThan(+rhs), next })
        else wf.conditions.push({ lhs: lhs as Categories, fn: greaterThan(+rhs), next })
      } else wf.default = condition
    })

    workflowsMap.set(workflowIdx, wf)
  })
}

function handleCondition(rating: Record<Categories, number>, workflowIdx: string): 'R' | 'A' {
  const workflow = workflowsMap.get(workflowIdx)!

  for (const condition of workflow.conditions) {
    const lhs = rating[condition.lhs]

    if (lhs !== undefined && condition.fn(lhs)) {
      if (condition.next === 'A' || condition.next === 'R') return condition.next

      return handleCondition(rating, condition.next)
    }
  }

  return workflow.default === 'R' || workflow.default === 'A'
    ? workflow.default
    : handleCondition(rating, workflow.default)
}

export function first() {
  init()

  let sum = 0

  partRatings.forEach((partRating) => {
    const lhsConditions = partRating.slice(1, -1).split(',')

    const rating: Record<Categories, number> = { x: 0, m: 0, a: 0, s: 0 }

    lhsConditions.forEach((lhsCondition) => {
      const condition = lhsCondition.split('=')[0]
      const lhs = lhsCondition.split('=')[1]

      rating[condition as Categories] = +lhs
    })

    if (handleCondition(rating, 'in') === 'A')
      sum += Object.values(rating).reduce((prev, curr) => (prev = prev + curr), 0)
  })

  console.log(sum)
}
