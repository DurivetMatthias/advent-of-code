const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => line
        .split("\t")
        .map(n => parseInt(n))
    )

console.log('parsed: ', parsed)
const checksum = parsed
    .map(row => row.sort((a, b) => a - b))
    .reduce((total, row) => {
        return total + row.slice(-1)[0] - row[0]
    }, 0)
console.log('checksum: ', checksum)

const evenDivision = parsed
    .map(row => {
        return row.map((numerator, nIndex) => {
            return row.map((denominator, dIndex) => {
                if (nIndex === dIndex) return null
                if (numerator % denominator != 0) return false
                return numerator / denominator
            }).filter(n => Boolean(n))[0]
        }).filter(n => Boolean(n))[0]
    })
    .reduce((total, n) => {
        return total + n
    }, 0)

console.log('evenDivision: ', evenDivision)
