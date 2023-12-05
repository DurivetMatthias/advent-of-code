const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)

const [seedsLine, ...mapLines] = parsed.split("\n\n")
// console.log(mapLines)
// console.log(seedsLine)

const seeds = seedsLine.replace("seeds: ", "").split(" ").map(Number)
// console.log(seeds)

const incompleteMaps = mapLines
    .map(line => line.split(":\n")[1])
    .map(line => line.split("\n")
        .map(rangeLine => ({
            destinationRangeStart: Number(rangeLine.split(" ")[0]),
            sourceRangeStart: Number(rangeLine.split(" ")[1]),
            rangeLength: Number(rangeLine.split(" ")[2]),
        }))
        .map(({ destinationRangeStart, sourceRangeStart, rangeLength }) => ({
            destinationRangeStart, sourceRangeStart, rangeLength,
            sourceRangeEnd: sourceRangeStart + rangeLength,
            destinationRangeEnd: destinationRangeStart + rangeLength,
        }))
    )
// console.log(incompleteMaps[0])
const maps = incompleteMaps
    .map(mappings => {
        const sortedMappings = mappings.sort((a, b) => a.sourceRangeStart - b.sourceRangeStart)
        return sortedMappings
    })
    .map(mappings => {
        const accumulator = []
        for (let i = 0; i < mappings.length - 1; i++) {
            const current = mappings[i]
            accumulator.push(current)
            const next = mappings[i + 1]
            if (current.sourceRangeEnd < next.sourceRangeStart) {
                const destinationRangeStart = current.destinationRangeStart + current.rangeLength
                const sourceRangeStart = current.sourceRangeEnd
                const rangeLength = next.sourceRangeStart - current.sourceRangeEnd - current.rangeLength
                const sourceRangeEnd = sourceRangeStart + rangeLength
                const destinationRangeEnd = destinationRangeStart + rangeLength
                const missingRange = {
                    destinationRangeStart,
                    sourceRangeStart,
                    rangeLength,
                    sourceRangeEnd,
                    destinationRangeEnd,
                }
                accumulator.push(missingRange)
            }
        }
        if (accumulator[0].sourceRangeStart > 0) {

            const destinationRangeStart = 0
            const sourceRangeStart = 0
            const rangeLength = accumulator[0].sourceRangeStart
            const sourceRangeEnd = sourceRangeStart + rangeLength
            const destinationRangeEnd = destinationRangeStart + rangeLength
            accumulator.unshift({
                destinationRangeStart,
                sourceRangeStart,
                rangeLength,
                sourceRangeEnd,
                destinationRangeEnd,
            })
        }
        const lastMapping = mappings[mappings.length - 1]
        accumulator.push(lastMapping)
        const destinationRangeStart = lastMapping.sourceRangeStart + lastMapping.rangeLength
        const sourceRangeStart = lastMapping.sourceRangeStart + lastMapping.rangeLength
        const rangeLength = Infinity
        const sourceRangeEnd = sourceRangeStart + rangeLength
        const destinationRangeEnd = destinationRangeStart + rangeLength
        accumulator.push({
            destinationRangeStart,
            sourceRangeStart,
            rangeLength,
            sourceRangeEnd,
            destinationRangeEnd,
        })
        return accumulator
    })

// console.log(maps[0])

// const findMapping = (number, mapping) => {
//     for (let map of mapping) {
//         if (number >= map.sourceRangeStart && number < map.sourceRangeStart + map.rangeLength) {
//             return number - map.sourceRangeStart + map.destinationRangeStart
//         }
//     }
//     throw new Error("No mapping found, all numbers should be accounted for by mapping")
// }

// const testSeed = 100000
// const testMap = maps[0]
// const testResult = findMapping(testSeed, testMap)
// console.log(testResult)
// let intermediate = seeds.slice()

// for (i = 0; i < maps.length; i++) {
//     map = maps[i]
//     intermediate = intermediate.map(number => findMapping(number, map))
// }

// const locations = intermediate.slice()
// const lowestLocation = Math.min(...locations)
// // console.log(locations)
// // console.log(lowestLocation)

// ------
// Part 2
// ------

const seedsToRanges = array => {
    const ranges = []
    for (let i = 0; i < array.length; i += 2) {
        const start = array[i]
        const length = array[i + 1]
        const end = start + length
        ranges.push({
            start,
            length,
            end,
        })
    }
    return ranges
}

const seedRanges = seedsToRanges(seeds)
console.log('seedRanges:', seedRanges)

const mapRangeToNewRanges = (range, rangeMappings) => {
    // console.log('range:', range)
    const newRanges = []
    rangeMappings.forEach(rangeMapping => {
        let start = null
        let length = null
        let end = null

        const mappingStartBefore = rangeMapping.sourceRangeStart < range.start
        const mappingStartInside = rangeMapping.sourceRangeStart >= range.start && rangeMapping.sourceRangeStart < range.end
        // Start after means they are not overlapping
        // const mappingStartAfter = rangeMapping.sourceRangeStart >= range.end
        // End before means they are not overlapping
        // const mappingEndBefore = rangeMapping.sourceRangeEnd < range.start
        const mappingEndInside = rangeMapping.sourceRangeEnd >= range.start && rangeMapping.sourceRangeEnd < range.end
        const mappingEndAfter = rangeMapping.sourceRangeEnd >= range.end

        if (mappingStartInside && mappingEndInside) {
            // console.log("mappingStartInside && mappingEndInside")
            // console.log(rangeMapping)
            // console.log(range)
            start = rangeMapping.destinationRangeStart
            end = rangeMapping.destinationRangeEnd

        } else if (mappingStartBefore && mappingEndAfter) {
            // console.log("mappingStartBefore && mappingEndAfter")
            // console.log(rangeMapping)
            // console.log(range)
            const startDiff = range.start - rangeMapping.sourceRangeStart
            start = rangeMapping.destinationRangeStart + startDiff
            end = start + range.length

        } else if (mappingStartBefore && mappingEndInside) {
            // console.log("mappingStartBefore && mappingEndInside")
            // console.log(rangeMapping)
            // console.log(range)
            const startDiff = range.start - rangeMapping.sourceRangeStart
            start = rangeMapping.destinationRangeStart + startDiff
            end = rangeMapping.destinationRangeEnd

        } else if (mappingStartInside && mappingEndAfter) {
            // console.log("mappingStartInside && mappingEndAfter")
            // console.log(rangeMapping)
            // console.log(range)
            start = rangeMapping.destinationRangeStart
            end = start + range.length
        }

        if (start !== null && end !== null) {
            length = end - start
            const newRange = {
                start,
                length,
                end,
            }
            // console.log(newRange)
            // console.log("\n\n\n")
            newRanges.push(newRange)
        }
    })
    return newRanges
}

// const testRange = seedRanges[0]
// console.log('testRange:', testRange)
// const testRangeMapping = maps[0]
// console.log('testRangeMapping:', testRangeMapping)
// const testResult = mapRangeToNewRanges(testRange, testRangeMapping)
// console.log('testResult:', testResult)

let intermediate = [...seedRanges]
for (i = 0; i < maps.length; i++) {
    const map = maps[i]
    const newRanges = intermediate.map(range => mapRangeToNewRanges(range, map))
    intermediate = newRanges.flat()
    // console.log('intermediate:', intermediate)
}
// console.log('intermediate:', intermediate)
const locationRanges = intermediate.slice().filter(range => range.start !== 0)
const lowestLocation = Math.min(...locationRanges.map(range => range.start))
console.log('lowestLocation:', lowestLocation)
