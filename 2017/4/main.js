const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => line.split(" "))
    .map(words => ({
        all: words,
        unique: new Set(words),
    }))
console.log('parsed: ', parsed)

const validPassphrases = parsed.filter(({ all, unique }) => all.length === unique.size)
console.log('validPassphrases.length: ', validPassphrases.length)

const doubleValid = validPassphrases
    .filter(({ all }) => {
        const sortedWords = all.map(word => word.split("").sort().join(""))
        return !sortedWords.some((word, index) => sortedWords.slice(index + 1).includes(word))
    })
console.log('doubleValid.length: ', doubleValid.length)
