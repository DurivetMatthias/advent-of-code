const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => {
        const [a, b] = line.split(",")
        const [aStart, aEnd, bStart, bEnd] = [...a.split("-"), ...b.split("-")].map(n => parseInt(n))
        return {
            aStart,
            aEnd,
            bStart,
            bEnd,
        }
    })
console.log('parsed: ', parsed)


const fullyContains = parsed
    .filter(({ aStart, aEnd, bStart, bEnd, }) => {
        if (aStart >= bStart && aEnd <= bEnd) return true
        if (bStart >= aStart && bEnd <= aEnd) return true
        return false
    })
    .length

console.log('fullyContains: ', fullyContains)

function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
const range = n => Array.from(Array(n).keys())

const intersectionLength = parsed
    .map(({ aStart, aEnd, bStart, bEnd, }) => {
        const aSet = new Set(range(aEnd - aStart + 1).map(n => n + aStart))
        const bSet = new Set(range(bEnd - bStart + 1).map(n => n + bStart))
        return {
            aStart, aEnd, bStart, bEnd,
            aSet, bSet,
        }
    })
    .map(({ aSet, bSet }) => intersection(aSet, bSet))
    .filter(intersection => intersection.size > 0)
    .length

console.log('intersectionLength: ', intersectionLength)
// const aSet = new Set(range(aEnd - aStart))
