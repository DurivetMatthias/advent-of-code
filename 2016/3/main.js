const { readFile } = require("../../common/io.js")
const { transpose } = require("../../common/util.js")

const data = readFile(__dirname)

const parsed = data
    .slice(0, -1)
    .split("\n")
    .map(l => [
        parseInt(l.slice(0, 5)),
        parseInt(l.slice(5, 10)),
        parseInt(l.slice(10, 15)),
    ])


// const sorted = parsed
//     .map(e => e.sort((a, b) => a - b))

// const possible = sorted
//     .filter(e => e[0] + e[1] > e[2])

// console.log('possible #1: ', possible.length)

const parsedTwo = transpose(parsed)
    .flat()
    .reduce((result, element, index) => {
        if (index % 3 === 2) {
            return [...result.slice(0, -2), [...result.slice(-2), element]]
        } else {
            return [...result, element]
        }
    }, [])

const sorted = parsedTwo
    .map(e => e.sort((a, b) => a - b))

const possible = sorted
    .filter(e => e[0] + e[1] > e[2])

console.log('possible #2: ', possible.length)
