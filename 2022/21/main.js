const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const regex = new RegExp("([a-z]{4}): ([a-z]{4}) ([-+*/]{1}) ([a-z]{4})")
        const result = line.match(regex)
        if (result) {
            const [x, a, operation, b] = result.slice(1, 5)
            return {
                x, a, operation, b
            }
        } else {
            const [x, a] = line.split(": ")
            return { x, a: parseInt(a), operation: "+", b: 0 }
        }
    })
    .sort((a, b) => a.x - b.x)
    .reduce((result, { x, a, operation, b }) => ({
        ...result,
        [x]: { a, operation, b }
    }), {})
// part 2
const HUMAN = "???"
const ROOT = "==="
parsed["humn"].operation = HUMAN
parsed["root"].operation = ROOT
console.log('parsed: ', parsed)

const results = {}

const recursiveOperation = (x, humanAnswer) => {
    if (Number.isInteger(x)) return x
    else {
        const { a, operation, b } = parsed[x]
        const realA = recursiveOperation(a, humanAnswer)
        const realB = recursiveOperation(b, humanAnswer)
        if (operation === "+") return realA + realB
        if (operation === "-") return realA - realB
        if (operation === "*") return realA * realB
        if (operation === "/") return realA / realB
        if (operation === ROOT) return [realA, realB]
        if (operation === HUMAN) return humanAnswer
    }
}

const getDifference = testNumber => {
    const [a, b] = recursiveOperation("root", testNumber)
    return b - a
}

const binarySearch = () => {
    let lowerInput = 2 ** 41
    let upperInput = 2 ** 42
    let closestLower = getDifference(lowerInput)
    let closestUpper = getDifference(upperInput)
    let steps = 0
    while (closestLower !== 0 && closestUpper !== 0 && steps < 1000 * 1000) {
        const newInput = Math.round((lowerInput + upperInput) / 2)
        const difference = getDifference(newInput)
        if (difference < 0) {
            lowerInput = newInput
            closestLower = difference
        } else {
            upperInput = newInput
            closestUpper = difference
        }
        steps += 1
    }
    console.log('closestLower: ', closestLower)
    console.log('lowerInput: ', lowerInput)
    console.log('closestUpper: ', closestUpper)
    console.log('upperInput: ', upperInput)
}
binarySearch()
