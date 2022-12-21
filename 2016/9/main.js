const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const expandLine = line => {
    const markerRegex = new RegExp("\\([0-9]+x[0-9]+\\)")
    let minimumIndex = 0
    let matchResult = line.match(markerRegex)
    let result = ""

    if (!matchResult) return line

    while (matchResult) {
        const nextMarker = matchResult[0]
        const [numberOfChars, numberOfRepeats] = nextMarker.replace("(", "").replace(")", "").split("x").map(n => parseInt(n))
        const nextMarkerStart = minimumIndex + matchResult.index
        const nextMarkerEnd = nextMarkerStart + nextMarker.length
        const stringToRepeat = line.slice(nextMarkerEnd, nextMarkerEnd + numberOfChars)

        result = result + line.slice(minimumIndex, nextMarkerStart)
        result = result + stringToRepeat.repeat(numberOfRepeats)

        // Increment index
        minimumIndex = nextMarkerEnd + numberOfChars
        matchResult = line.slice(minimumIndex).match(markerRegex)
    }
    result = result + line.slice(minimumIndex)
    return result
}

const predictDecompressedLength = line => {
    const markerRegex = new RegExp("\\([0-9]+x[0-9]+\\)")
    let minimumIndex = 0
    let matchResult = line.match(markerRegex)
    let result = 0

    if (!matchResult) return line.length

    while (matchResult) {
        const nextMarker = matchResult[0]
        const [numberOfChars, numberOfRepeats] = nextMarker.replace("(", "").replace(")", "").split("x").map(n => parseInt(n))
        const nextMarkerStart = minimumIndex + matchResult.index
        const nextMarkerEnd = nextMarkerStart + nextMarker.length
        const stringToRepeat = line.slice(nextMarkerEnd, nextMarkerEnd + numberOfChars)

        result = result + nextMarkerStart - minimumIndex
        result = result + numberOfRepeats * predictDecompressedLength(stringToRepeat)

        // Increment index
        minimumIndex = nextMarkerEnd + numberOfChars
        matchResult = line.slice(minimumIndex).match(markerRegex)
    }
    result = result + line.length - minimumIndex
    return result
}

const parsed = data
    .split("\n")
    .map(expandLine)
// console.log('parsed: ', parsed)
const decompressedLength = parsed.reduce((total, line) => total + line.length, 0)
console.log('decompressedLength: ', decompressedLength)

const realDecompressedLength = predictDecompressedLength(data)
console.log('realDecompressedLength: ', realDecompressedLength)
