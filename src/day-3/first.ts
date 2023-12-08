import { partNumbers } from "./input"

function isDigit(charCode: number){
  return (charCode >= 0x30 && charCode <= 0x39)
}
function isDot(charCode: number){
  return charCode === '.'.charCodeAt(0)
}

function checkAdjacentLine(lineNumber: number, startIdx: number, cnt: number) {
  if(lineNumber < 0 || lineNumber >= partNumbers.length)
    return false

  for(let i = startIdx; i < startIdx + cnt; i++) {
    if(i >= 0 && i < partNumbers[lineNumber].length) {
      const charCode = partNumbers[lineNumber].charCodeAt(i) 

      if(isDigit(charCode) === false && isDot(charCode) === false)
        return true
    }
  }

  return false
}

export function first() {
	let partNumberSum = 0

	partNumbers.forEach((val, lineIdx) => {
		let partNumber = 0
		let partNumberIdx: number[] = []

		for(let i = 0; i < val.length; i++) {
			const charCode = val.charCodeAt(i)

			if(isDigit(charCode)) {
				partNumber = partNumber * 10 + charCode - 0x30
				partNumberIdx.push(i)
			}
			else {
				if(partNumber) {
					if(
						checkAdjacentLine(lineIdx-1, partNumberIdx[0] - 1, partNumberIdx.length + 2) ||
						checkAdjacentLine(lineIdx, partNumberIdx[0] - 1, partNumberIdx.length+2) ||
						checkAdjacentLine(lineIdx+1, partNumberIdx[0] - 1, partNumberIdx.length+ 2))
							partNumberSum += partNumber

						partNumber = 0
						partNumberIdx = []
				}
			}
		}

		// Check end of line if number is available
		if(partNumber) {
			if(
			checkAdjacentLine(lineIdx-1, partNumberIdx[0] - 1, partNumberIdx.length + 2) ||
			checkAdjacentLine(lineIdx, partNumberIdx[0] - 1, partNumberIdx.length+2) ||
			checkAdjacentLine(lineIdx+1, partNumberIdx[0] - 1, partNumberIdx.length+ 2))
				partNumberSum += partNumber
		}
	})

	console.log(partNumberSum)
}