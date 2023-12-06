const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)
    .replace("Time:", "")
    .replace("Distance:", "")
    .trim()
    .split("\n")

const [times, distances] = parsed.map(line => line.split(" ").filter(x => x !== "").map(Number))

const zip = (a, b) => a.map((k, i) => [k, b[i]])

const records = zip(times, distances)
    .map(([time, distance]) => ({ distance, time }))

const calculateTotalDistance = (timePressed, totalTime) => {
    const remainingTime = totalTime - timePressed
    const speed = timePressed
    const distance = speed * remainingTime
    return distance
}

const simulateOptions = ({ time, distance: recordDistance }) => {
    const timeOptions = range(time + 1)
    const distanceResults = timeOptions.map(timePressed => calculateTotalDistance(timePressed, time))
    const options = zip(timeOptions, distanceResults)
        .map(([timePressed, distance]) => ({
            timePressed,
            distance,
            isNewRecord: distance > recordDistance,
        }))
    return options
}

const allOptions = records.map(({ time, distance }) => simulateOptions({ time, distance }))

const numberOfWaysToBeatAllRecords = allOptions
    .map(options => options.filter(({ isNewRecord }) => isNewRecord).length)
    .reduce((a, b) => a * b, 1)
console.log('numberOfWaysToBeatAllRecords:', numberOfWaysToBeatAllRecords)

const totalTime = parseInt(times.reduce((a, b) => a + b, ""))
const recordDistance = parseInt(distances.reduce((a, b) => a + b, ""))
console.log('totalTime:', totalTime)
console.log('recordDistance:', recordDistance)

// Brute force just goes out of memory :)

const GO_UP = "GO_UP"
const GO_DOWN = "GO_DOWN"
const THIS_IS_THE_BOUNDARY = "THIS_IS_THE_BOUNDARY"

const upperBoundaryPredicate = (timePressed) => {
    const thisDistance = calculateTotalDistance(timePressed, totalTime)
    const nextDistance = calculateTotalDistance(timePressed + 1, totalTime)
    const thisDistanceWins = thisDistance > recordDistance
    const nextDistanceWins = nextDistance > recordDistance
    if (thisDistanceWins && !nextDistanceWins) return THIS_IS_THE_BOUNDARY
    if (thisDistanceWins && nextDistanceWins) return GO_UP
    if (!thisDistanceWins && !nextDistanceWins) return GO_DOWN
}

const lowerBoundaryPredicate = (timePressed) => {
    const thisDistance = calculateTotalDistance(timePressed, totalTime)
    const previousDistance = calculateTotalDistance(timePressed - 1, totalTime)
    const thisDistanceWins = thisDistance > recordDistance
    const previousDistanceWins = previousDistance > recordDistance
    if (thisDistanceWins && !previousDistanceWins) return THIS_IS_THE_BOUNDARY
    if (thisDistanceWins && previousDistanceWins) return GO_DOWN
    if (!thisDistanceWins && !previousDistanceWins) return GO_UP
}

const binarySearch = (start, end, predicate) => {
    if (start >= end) return "FAILED"
    const mid = Math.floor((start + end) / 2)
    const result = predicate(mid)
    if (result === THIS_IS_THE_BOUNDARY) return mid
    if (result === GO_UP) return binarySearch(mid, end, predicate)
    if (result === GO_DOWN) return binarySearch(start, mid, predicate)
}

const middle = Math.floor((totalTime) / 2)
console.log(
    'middle breaks the record:',
    calculateTotalDistance(middle, totalTime) > recordDistance
)
const upperBound = binarySearch(middle, totalTime, upperBoundaryPredicate)
console.log('upperBound:', upperBound)
const lowerBound = binarySearch(0, middle, lowerBoundaryPredicate)
console.log('lowerBound:', lowerBound)

const waysToWin = upperBound - lowerBound + 1
console.log('waysToWin:', waysToWin)
