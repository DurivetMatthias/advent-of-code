const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")
const splitMarker = "#"
const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const numbers = line
            .replaceAll("Sensor at x=", "")
            .replaceAll(", y=", splitMarker)
            .replaceAll(": closest beacon is at x=", splitMarker)
            .replaceAll(", y=", splitMarker)
            .split(splitMarker)
            .map(n => parseInt(n))
        return {
            sensor: {
                x: numbers[0],
                y: numbers[1],
            },
            beacon: {
                x: numbers[2],
                y: numbers[3],
            }
        }
    })

// console.log('parsed: ', parsed)
// const largestX = parsed.map(x => [x.sensor.x, x.beacon.x]).flat().sort((a, b) => b - a)[0]
// const largestY = parsed.map(x => [x.sensor.y, x.beacon.y]).flat().sort((a, b) => b - a)[0]

const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
const encodePos = pos => `${pos.x}/${pos.y}`
const decodePos = encoding => {
    const numbers = encoding.split("/").map(n => parseInt(n))
    return { x: numbers[0], y: numbers[1] }
}
const overlapRanges = (result, range) => {
    const newResult = []
    if (result.length === 0) {
        newResult.push({
            ...range
        })
    } else {
        result.forEach(otherRange => {
            if (otherRange.start > range.start && otherRange.end < range.end) {
                newResult.push({
                    ...range
                })
            } else if (otherRange.start < range.start && otherRange.end > range.end) {
                newResult.push({
                    ...otherRange
                })
            } else if (otherRange.end + 1 === range.start) {
                newResult.push({
                    start: otherRange.start,
                    end: range.end,
                })
            } else if (otherRange.start === range.end + 1) {
                newResult.push({
                    start: range.start,
                    end: otherRange.end,
                })
            } else if (otherRange.end < range.start) {
                newResult.push({
                    ...otherRange,
                })
                newResult.push({
                    ...range
                })
            } else if (otherRange.start > range.end) {
                newResult.push({
                    ...range
                })
                newResult.push({
                    ...otherRange,
                })
            } else if (otherRange.start >= range.start && otherRange.end >= range.end) {
                newResult.push({
                    start: range.start,
                    end: otherRange.end
                })
            } else if (otherRange.start <= range.start && otherRange.end <= range.end) {
                newResult.push({
                    start: otherRange.start,
                    end: range.end
                })
            }
        })
    }
    return newResult
}

const findCoveredRange = testRow => {

    const withCoverage = parsed.map(pair => {
        const mhDist = manhattanDistance(pair.sensor, pair.beacon)
        const verticalDist = Math.abs(testRow - pair.sensor.y)
        const coverageStart = pair.sensor.x - mhDist + verticalDist
        const coverageEnd = pair.sensor.x + mhDist - verticalDist
        return {
            ...pair,
            start: coverageStart <= pair.sensor.x ? coverageStart : null,
            end: coverageEnd >= pair.sensor.x ? coverageEnd : null,
        }
    })
        .filter(pair => pair.start !== null && pair.end !== null)
    // console.log('withCoverage: ', withCoverage.sort((a, b) => a.sensor.x - b.sensor.x)
    //     .map(pair => ({ start: pair.coverageStart, end: pair.coverageEnd })))

    const grouped = withCoverage
        .sort((a, b) => a.sensor.x - b.sensor.x)
        .map(pair => ({ start: pair.start, end: pair.end }))
        .reduce(overlapRanges, [])
        .reduce(overlapRanges, [])
        .reduce(overlapRanges, [])


    return grouped
}

// const testRow = 10
const testRow = 2000000
const grouped = findCoveredRange(testRow)
const groupedCoverage = grouped.reduce((total, range) => {
    return total + range.end - range.start + 1
}, 0)
const uniqueBeacons = [...(new Set(
    parsed
        .map(pair => pair.beacon)
        .map(beacon => encodePos(beacon))
))]
    .map(decodePos)

const testRowCoverage = groupedCoverage - uniqueBeacons.filter(beacon => beacon.y === testRow).length

console.log('testRowCoverage: ', testRowCoverage)

// const searchSpace = 20
const searchSpace = 4000000
// range(searchSpace + 1)
//     .forEach(y => {
//         if (y % (4000000 / 100) === 0) console.log('y: ', y)
//         const coverage = findCoveredRange(y)
//         if (coverage.length > 1) {
//             console.log()
//             console.log('y: ', y)
//             // console.log('coverage: ', coverage)
//             console.log('coverage: ', coverage)
//             console.log()
//         }
//     })
const distressBeacon = {
    x: 2673432,
    y: 3308112,
}
const tuningFreq = distressBeacon.x * searchSpace + distressBeacon.y
console.log('tuningFreq: ', tuningFreq)
