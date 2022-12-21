const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => parseInt(line))


console.log('parsed: ', parsed)
const totalFrequency = parsed.reduce((total, n) => total + n, 0)
console.log('totalFrequency: ', totalFrequency)

const repeatingList = new Array(1000).fill(null).map(() => parsed).flat()

repeatingList.reduce(({ currentFrequency, cache }, n) => {
    if (cache.has(currentFrequency)) {
        console.log('repeat: ', currentFrequency)
        return null
    }
    cache.add(currentFrequency)

    return {
        currentFrequency: currentFrequency + n,
        cache,
    }
}, { currentFrequency: 0, cache: new Set() })
