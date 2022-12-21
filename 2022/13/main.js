const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n\n")
    .map(pair => pair.split("\n"))
    .map(pair => ({
        left: JSON.parse(pair[0]),
        right: JSON.parse(pair[1]),
    }))

// console.log('parsed: ', parsed)

const validatePair = (left, right) => {
    // console.log(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`)
    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left < right) {
            // console.log("Left side is smaller, so inputs are in the right order")
            return true
        }
        if (left > right) {
            // console.log("Right side is smaller, so inputs are not in the right order")
            return false
        }
        if (left === right) return null
    }

    if (Array.isArray(left) && Array.isArray(right)) {
        const commonIndices = Math.min(left.length, right.length)
        let result = null
        let i = 0
        while (i < commonIndices && result === null) {
            const recursiveValidation = validatePair(left[i], right[i])
            if (recursiveValidation === true) result = true
            if (recursiveValidation === false) result = false
            if (recursiveValidation === null) {
                // continue
            }
            i += 1
        }
        if (result !== null) return result

        if (left.length < right.length) {
            // console.log("Left side ran out of items, so inputs are in the right order")
            return true
        }
        if (left.length > right.length) {
            // console.log("Right side ran out of items, so inputs are not in the right order")
            return false
        }
        if (left.length === right.length) {
            // console.log("Both sides are empty")
            return null
        }
    }

    let l = Array.isArray(left) ? left : [left]
    let r = Array.isArray(right) ? right : [right]
    if (!Array.isArray(left)) {
        // console.log(`Mixed types; convert left to ${JSON.stringify(l)} and retry comparison`)
    }
    if (!Array.isArray(right)) {
        // console.log(`Mixed types; convert right to ${JSON.stringify(r)} and retry comparison`)
    }
    return validatePair(l, r)

}

// const debug = 7
const validatedPairs = parsed
    // .slice(debug - 1, debug)
    .map(({ left, right }) => {
        return {
            left,
            right,
            valid: validatePair(left, right),
        }
    })
// console.log('validatedPairs: ', validatedPairs)
const sumOfValidIndices = validatedPairs
    .map((pair, i) => pair.valid ? i + 1 : 0)
    .reduce((total, n) => total + n)
// console.log('sumOfValidIndices: ', sumOfValidIndices)

const dividerStart = [[2]]
const dividerEnd = [[6]]

const altered = [
    ...readFile(__dirname)
        .replaceAll("\n\n", "\n")
        .split("\n")
        .map(line => JSON.parse(line)),
    dividerStart,
    dividerEnd,
]
const sortedPackets = altered
    .sort((a, b) => {
        const result = validatePair(a, b)
        if (result === true) return -1
        if (result === false) return 1
    })
// console.log('sortedPackets: ', sortedPackets)

const dividerPackets = sortedPackets
    .map((value, index) => ({ value, index: index + 1 }))
    .filter(({ value }) => value === dividerStart || value === dividerEnd)

// console.log('dividerPackets: ', dividerPackets)
const decoderKey = dividerPackets
    .map(({ index }) => index)
    .reduce((total, n) => total * n)
console.log('decoderKey: ', decoderKey)
