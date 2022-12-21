const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .reduce((totalResult, line) => {
        const newResult = { ...totalResult }
        Object.values(line)
            .map((letter, index) => {
                if (newResult[index][letter]) newResult[index][letter] += 1
                else newResult[index][letter] = 1
            })
        return newResult
    }, [{}, {}, {}, {}, {}, {}, {}, {}])
console.log('parsed: ', parsed)

const originalMessage = Object.values(parsed)
    .map((letterOccurences, index) => {
        return Object.entries(letterOccurences)
            .sort(([aKey, aValue], [bKey, bValue]) => bValue - aValue)
        [0][0]
    })
    .join("")

console.log('originalMessage: ', originalMessage)

const secondMessage = Object.values(parsed)
    .map((letterOccurences, index) => {
        return Object.entries(letterOccurences)
            .sort(([aKey, aValue], [bKey, bValue]) => aValue - bValue)
        [0][0]
    })
    .join("")

console.log('secondMessage: ', secondMessage)
