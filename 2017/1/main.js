const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("")
    .map(n => parseInt(n))
console.log('parsed: ', parsed)

const sumOfMatching = parsed
    .filter((n, i) => n === parsed[(i + parsed.length / 2) % parsed.length])
    .reduce((total, n,) => total + n, 0)

console.log('sumOfMatching: ', sumOfMatching)
