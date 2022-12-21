const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)

console.log('parsed: ', parsed)

const numbers = parsed.split("").map(l => {
    const asciiCode = l.charCodeAt(0)
    if (asciiCode >= "a".charCodeAt(0)) return asciiCode - "a".charCodeAt(0) + 1
    if (asciiCode >= "A".charCodeAt(0)) return (asciiCode - "A".charCodeAt(0) + 1) * -1
})
console.log('numbers: ', numbers)


const simulateReaction = (polymer, removedElement = null) => {
    const livePolymer = Boolean(removedElement) ? [...polymer.filter(x => Math.abs(x) !== removedElement)] : [...polymer]
    let finished = false
    while (!finished) {
        const startLength = livePolymer.length
        range(livePolymer.length)
            .reverse()
            .forEach(index => {
                const a = livePolymer[index]
                const b = index + 1 < livePolymer.length ? livePolymer[index + 1] : 0
                if (a + b === 0) {
                    livePolymer.splice(index, 2)
                }
            })
        if (livePolymer.length === startLength) finished = true
    }
    return livePolymer.length
}

const possibleLengths = range("z".charCodeAt(0) - "a".charCodeAt(0))
    .map(n => simulateReaction(numbers, n))

const shortest = possibleLengths.sort((a, b) => a - b)[0]
console.log('shortest: ', shortest)
